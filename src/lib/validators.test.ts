import { describe, expect, it } from "vitest";
import { checkoutSchema, profileSchema, productSchema } from "./validators";

describe("checkoutSchema", () => {
  const valid = { items: [{ productId: "product-1", quantity: 2 }], recipientName: "Tegar Fauzan", recipientPhone: "081234567890", shippingAddress: "Jalan Kreatif 17", shippingCity: "Bandung", shippingPostalCode: "40123" };
  it("menerima payload checkout valid", () => expect(checkoutSchema.parse(valid).items[0]?.quantity).toBe(2));
  it("menolak quantity nol", () => expect(() => checkoutSchema.parse({ ...valid, items: [{ productId: "product-1", quantity: 0 }] })).toThrow());
  it("menolak kode pos berisi script", () => expect(() => checkoutSchema.parse({ ...valid, shippingPostalCode: "<script>" })).toThrow());
});

describe("server validation", () => {
  it("menolak profil dengan nama terlalu pendek", () => expect(() => profileSchema.parse({ name: "A" })).toThrow());
  it("menolak produk tanpa gambar", () => expect(() => productSchema.parse({ name: "Produk", categoryId: "category", description: "Deskripsi produk yang valid", price: 1000, stock: 2, images: [] })).toThrow());
});
