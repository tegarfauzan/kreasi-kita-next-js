export function normalizeCheckoutQuantity(rawQuantity: string | undefined, stock: number) {
  const parsedQuantity = Number(rawQuantity);
  const quantity = Number.isFinite(parsedQuantity) ? Math.floor(parsedQuantity) : 1;

  return Math.min(stock, Math.max(1, quantity));
}
