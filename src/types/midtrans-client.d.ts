declare module "midtrans-client" {
  interface Config { isProduction: boolean; serverKey: string; clientKey: string }
  interface SnapResponse { token: string; redirect_url: string }
  class Snap { constructor(config: Config); createTransaction(parameter: unknown): Promise<SnapResponse> }
  class CoreApi { constructor(config: Config); transaction: { notification(payload: unknown): Promise<Record<string, string>> } }
  const midtransClient: { Snap: typeof Snap; CoreApi: typeof CoreApi };
  export default midtransClient;
}
