import { timingSafeEqual } from "node:crypto";

export function matchesBearerToken(header: string | null, expected: string | undefined) {
  if (!expected || !header?.startsWith("Bearer ")) return false;

  const providedBuffer = Buffer.from(header.slice(7));
  const expectedBuffer = Buffer.from(expected);

  return providedBuffer.length === expectedBuffer.length && timingSafeEqual(providedBuffer, expectedBuffer);
}
