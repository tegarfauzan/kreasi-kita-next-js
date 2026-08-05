import { describe, expect, it } from "vitest";
import { matchesBearerToken } from "@/lib/secure-token";

describe("matchesBearerToken", () => {
  const secret = "a".repeat(48);

  it("menerima bearer token yang sama", () => {
    expect(matchesBearerToken(`Bearer ${secret}`, secret)).toBe(true);
  });

  it("menolak header, skema, atau token yang tidak valid", () => {
    expect(matchesBearerToken(null, secret)).toBe(false);
    expect(matchesBearerToken(secret, secret)).toBe(false);
    expect(matchesBearerToken(`Basic ${secret}`, secret)).toBe(false);
    expect(matchesBearerToken(`Bearer ${"b".repeat(48)}`, secret)).toBe(false);
    expect(matchesBearerToken(`Bearer pendek`, secret)).toBe(false);
  });

  it("menolak konfigurasi tanpa expected token", () => {
    expect(matchesBearerToken(`Bearer ${secret}`, undefined)).toBe(false);
  });
});
