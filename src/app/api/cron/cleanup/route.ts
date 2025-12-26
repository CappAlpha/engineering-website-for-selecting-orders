import { NextResponse } from "next/server";

import { cleanupStaleUnverifiedUsers } from "@/modules/Auth/utils/cleanupStaleUnverifiedUsers";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");

  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const result = await cleanupStaleUnverifiedUsers();
  return NextResponse.json({ ok: true, ...result });
}
