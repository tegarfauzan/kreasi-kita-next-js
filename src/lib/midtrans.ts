import "server-only";
import midtransClient from "midtrans-client";
import { env } from "@/env";

const config = {
  isProduction: env.MIDTRANS_IS_PRODUCTION,
  serverKey: env.MIDTRANS_SERVER_KEY,
  clientKey: env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
};

export const midtransSnap = new midtransClient.Snap(config);
export const midtransCore = new midtransClient.CoreApi(config);
