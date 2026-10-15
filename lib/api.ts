import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./supabase";
export const json = (
  message: string,
  status = 200,
  extra: Record<string, unknown> = {},
) =>
  NextResponse.json(
    { message, ...extra },
    { status, headers: { "Cache-Control": "no-store" } },
  );
export function unsafeRequest(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    // Next may normalize loopback in nextUrl; compare with the browser Host.
    return (
      parsed.host !== req.headers.get("host") ||
      parsed.protocol !== req.nextUrl.protocol ||
      Number(req.headers.get("content-length") || 0) > 6 * 1024 * 1024
    );
  } catch {
    return true;
  }
}
export async function identity() {
  const db = await supabase();
  if (!db) return { db: null, user: null };
  const {
    data: { user },
  } = await db.auth.getUser();
  return { db, user };
}
