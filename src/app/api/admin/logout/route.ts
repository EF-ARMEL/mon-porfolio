import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin/auth";

export const runtime = "nodejs";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...sessionCookieClear(), maxAge: 0 });
  return res;
}

function sessionCookieClear() {
  return { httpOnly: true, sameSite: "lax" as const, secure: process.env.NODE_ENV === "production", path: "/" };
}
