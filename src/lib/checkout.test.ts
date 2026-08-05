import { describe, expect, it } from "vitest";
import { normalizeCheckoutQuantity } from "./checkout";

describe("normalizeCheckoutQuantity", () => {
  it("menggunakan satu untuk quantity kosong atau bukan angka", () => {
    expect(normalizeCheckoutQuantity(undefined, 10)).toBe(1);
    expect(normalizeCheckoutQuantity("abc", 10)).toBe(1);
  });

  it("mencegah quantity nol dan negatif", () => {
    expect(normalizeCheckoutQuantity("0", 10)).toBe(1);
    expect(normalizeCheckoutQuantity("-4", 10)).toBe(1);
  });

  it("membulatkan quantity pecahan dan membatasinya sesuai stok", () => {
    expect(normalizeCheckoutQuantity("2.9", 10)).toBe(2);
    expect(normalizeCheckoutQuantity("99", 4)).toBe(4);
  });
});
