import { NextResponse } from "next/server";
import { env } from "@/env";
import { expireOrders } from "@/lib/orders";
import { matchesBearerToken } from "@/lib/secure-token";

export async function POST(request: Request) {
  if (!matchesBearerToken(request.headers.get("authorization"), env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ expired: await expireOrders() });
}
