import { z } from "zod";

const id = z.string().min(1).max(191);
const cleanText = (min: number, max: number) => z.string().trim().min(min).max(max);

export const profileSchema = z.object({
  name: cleanText(2, 100),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(1000).optional().or(z.literal("")),
  city: z.string().trim().max(100).optional().or(z.literal("")),
  postalCode: z.string().trim().max(12).regex(/^$|^[0-9-]+$/).optional(),
});

export const categorySchema = z.object({
  name: cleanText(2, 80),
  isActive: z.boolean().default(true),
});

export const productSchema = z.object({
  name: cleanText(2, 120),
  categoryId: id,
  description: cleanText(10, 4000),
  price: z.coerce.number().int().nonnegative().max(999_999_999_999),
  stock: z.coerce.number().int().nonnegative().max(1_000_000),
  badge: z.string().trim().max(40).optional().or(z.literal("")),
  keywords: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z.array(z.object({
    url: z.string().url().max(2048),
    publicId: z.string().max(255).optional(),
    alt: cleanText(2, 180),
    photographer: z.string().max(100).optional(),
    photoPage: z.string().url().max(2048).optional(),
  })).min(1).max(8),
});

export const checkoutSchema = z.object({
  items: z.array(z.object({ productId: id, quantity: z.coerce.number().int().min(1).max(99) })).min(1).max(20),
  recipientName: cleanText(2, 100),
  recipientPhone: z.string().trim().min(8).max(30),
  shippingAddress: cleanText(5, 1000),
  shippingCity: cleanText(2, 100),
  shippingPostalCode: z.string().trim().regex(/^[0-9-]{4,12}$/),
});

export const orderStatusSchema = z.object({ status: z.enum(["PROCESSING", "SHIPPED", "COMPLETED", "CANCELLED"]) });

export const settingsSchema = z.object({
  storeName: cleanText(2, 100),
  email: z.string().email().max(190),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  address: z.string().trim().max(1000).optional().or(z.literal("")),
  shippingCost: z.coerce.number().int().nonnegative().max(10_000_000),
});
