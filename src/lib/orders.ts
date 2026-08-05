import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { Prisma, type OrderStatus } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { ApiError } from "@/lib/api";
import { midtransCore, midtransSnap } from "@/lib/midtrans";
import { checkoutSchema } from "@/lib/validators";
import { env } from "@/env";

const terminalFailures: OrderStatus[] = ["FAILED", "EXPIRED", "CANCELLED"];
const orderInclude = { items: true, payment: true } as const;

export function toOrderDto(order: Awaited<ReturnType<typeof db.order.findFirstOrThrow>> & { items?: Array<{ id: string; productId: string; productName: string; productImageUrl: string; quantity: number; priceAtPurchase: Prisma.Decimal }>; payment?: { paymentType: string | null; transactionStatus: string } | null }) {
  return {
    id: order.id,
    date: order.createdAt.toISOString(),
    status: order.status,
    subtotal: Number(order.subtotal),
    shippingCost: Number(order.shippingCost),
    totalAmount: Number(order.totalAmount),
    redirectUrl: order.redirectUrl,
    recipientName: order.recipientName,
    recipientPhone: order.recipientPhone,
    shippingAddress: order.shippingAddress,
    shippingCity: order.shippingCity,
    shippingPostalCode: order.shippingPostalCode,
    payment: order.payment ?? null,
    items: (order.items ?? []).map((item) => ({ id: item.id, productId: item.productId, productName: item.productName, productImageUrl: item.productImageUrl, quantity: item.quantity, price: Number(item.priceAtPurchase) })),
  };
}

export async function createOrder(user: { id: string; email: string; name: string }, input: unknown) {
  const data = checkoutSchema.parse(input);
  const grouped = new Map<string, number>();
  for (const item of data.items) grouped.set(item.productId, (grouped.get(item.productId) ?? 0) + item.quantity);
  const itemInputs = [...grouped].map(([productId, quantity]) => ({ productId, quantity }));
  const settings = await db.storeSetting.findUnique({ where: { id: "default" } });
  const shippingCost = Number(settings?.shippingCost ?? 18000);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const orderId = `KK-${now.getFullYear()}-${randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase()}`;

  const order = await db.$transaction(async (tx) => {
    const products = await tx.product.findMany({ where: { id: { in: itemInputs.map((item) => item.productId) }, isActive: true }, include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } });
    if (products.length !== itemInputs.length) throw new ApiError(400, "Salah satu produk tidak tersedia.", "PRODUCT_UNAVAILABLE");
    let subtotal = 0;
    const items = itemInputs.map((item) => {
      const product = products.find((entry) => entry.id === item.productId)!;
      if (product.stock - product.reservedStock < item.quantity) throw new ApiError(409, `Stok ${product.name} tidak mencukupi.`, "INSUFFICIENT_STOCK");
      subtotal += Number(product.price) * item.quantity;
      return { product, quantity: item.quantity };
    });
    for (const item of items) {
      const updated = await tx.product.updateMany({
        where: { id: item.product.id, reservedStock: { lte: item.product.stock - item.quantity } },
        data: { reservedStock: { increment: item.quantity } },
      });
      if (updated.count !== 1) throw new ApiError(409, `Stok ${item.product.name} baru saja berubah. Silakan coba lagi.`, "STOCK_RACE");
    }
    return tx.order.create({
      data: {
        id: orderId, midtransOrderId: orderId, userId: user.id, subtotal, shippingCost, totalAmount: subtotal + shippingCost,
        recipientName: data.recipientName, recipientPhone: data.recipientPhone, shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity, shippingPostalCode: data.shippingPostalCode, expiresAt,
        items: { create: items.map(({ product, quantity }) => ({ productId: product.id, productName: product.name, productImageUrl: product.images[0]?.url ?? "", quantity, priceAtPurchase: product.price })) },
      },
      include: orderInclude,
    });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });

  try {
    const paymentFinishUrl = new URL("/payment/finish", env.NEXT_PUBLIC_APP_URL).toString();
    const transaction = await midtransSnap.createTransaction({
      transaction_details: { order_id: order.id, gross_amount: Number(order.totalAmount) },
      customer_details: { first_name: data.recipientName, email: user.email, phone: data.recipientPhone, billing_address: { address: data.shippingAddress, city: data.shippingCity, postal_code: data.shippingPostalCode, country_code: "IDN" } },
      item_details: [...order.items.map((item) => ({ id: item.productId, price: Number(item.priceAtPurchase), quantity: item.quantity, name: item.productName.slice(0, 50) })), { id: "SHIPPING", price: shippingCost, quantity: 1, name: "Ongkos kirim" }],
      callbacks: { finish: paymentFinishUrl, error: paymentFinishUrl },
      gopay: { enable_callback: true, callback_url: paymentFinishUrl },
      shopeepay: { callback_url: paymentFinishUrl },
      expiry: { unit: "hours", duration: 24 },
    });
    const updated = await db.order.update({ where: { id: order.id }, data: { snapToken: transaction.token, redirectUrl: transaction.redirect_url }, include: orderInclude });
    return toOrderDto(updated);
  } catch (error) {
    await releaseReservation(order.id, "FAILED");
    throw new ApiError(502, "Gateway pembayaran belum dapat dihubungi. Pesanan tidak ditagihkan.", "PAYMENT_GATEWAY_ERROR");
  }
}

async function releaseReservation(orderId: string, status: OrderStatus) {
  return db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order || order.reservationReleasedAt) return order;
    for (const item of order.items) await tx.product.update({ where: { id: item.productId }, data: { reservedStock: { decrement: item.quantity } } });
    return tx.order.update({ where: { id: orderId }, data: { status, reservationReleasedAt: new Date() } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

async function markPaid(orderId: string, payment: Record<string, string>, payload: unknown) {
  return db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    if (!order) throw new ApiError(404, "Pesanan tidak ditemukan.", "ORDER_NOT_FOUND");
    if (order.status !== "PAID") {
      if (order.reservationReleasedAt) throw new ApiError(409, "Reservasi stok pesanan telah dilepas.", "RESERVATION_RELEASED");
      for (const item of order.items) await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity }, reservedStock: { decrement: item.quantity } } });
      await tx.order.update({ where: { id: orderId }, data: { status: "PAID", reservationReleasedAt: new Date() } });
    }
    await tx.payment.upsert({ where: { orderId }, create: { orderId, transactionId: payment.transaction_id, paymentType: payment.payment_type, transactionStatus: payment.transaction_status ?? "settlement", fraudStatus: payment.fraud_status, rawResponse: payload as Prisma.InputJsonValue }, update: { transactionId: payment.transaction_id, paymentType: payment.payment_type, transactionStatus: payment.transaction_status ?? "settlement", fraudStatus: payment.fraud_status, rawResponse: payload as Prisma.InputJsonValue } });
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function processMidtransNotification(payload: unknown) {
  const normalized = JSON.stringify(payload);
  const payloadHash = createHash("sha256").update(normalized).digest("hex");
  if (await db.paymentWebhookEvent.findUnique({ where: { payloadHash } })) return { duplicate: true };
  const payment = await midtransCore.transaction.notification(payload);
  const orderId = payment.order_id;
  if (!orderId) throw new ApiError(400, "Notifikasi tidak memiliki order ID.", "INVALID_NOTIFICATION");
  const paid = ["capture", "settlement"].includes(payment.transaction_status) && (!payment.fraud_status || payment.fraud_status === "accept");
  const failureStatus: OrderStatus | null = payment.transaction_status === "expire" ? "EXPIRED" : payment.transaction_status === "cancel" ? "CANCELLED" : ["deny", "failure"].includes(payment.transaction_status) ? "FAILED" : null;
  if (paid) await markPaid(orderId, payment, payload);
  else if (failureStatus) await releaseReservation(orderId, failureStatus);
  await db.payment.upsert({ where: { orderId }, create: { orderId, transactionId: payment.transaction_id, paymentType: payment.payment_type, transactionStatus: payment.transaction_status ?? "unknown", fraudStatus: payment.fraud_status, rawResponse: payload as Prisma.InputJsonValue }, update: { transactionId: payment.transaction_id, paymentType: payment.payment_type, transactionStatus: payment.transaction_status ?? "unknown", fraudStatus: payment.fraud_status, rawResponse: payload as Prisma.InputJsonValue } });
  await db.paymentWebhookEvent.create({ data: { payloadHash, orderId, status: payment.transaction_status ?? "unknown", payload: payload as Prisma.InputJsonValue } });
  return { duplicate: false };
}

export async function expireOrders() {
  const rows = await db.order.findMany({ where: { status: "PENDING", expiresAt: { lt: new Date() }, reservationReleasedAt: null }, select: { id: true } });
  for (const row of rows) await releaseReservation(row.id, "EXPIRED");
  return rows.length;
}
