import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpSchema } from "@/lib/schemas";

const OTP_TTL_MS = 5 * 60 * 1000;

// DEV STUB: prints OTP to server console. Replace with 阿里云短信 in M2 Week 8 (PRD F1.1).
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = sendOtpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "手机号格式错误" }, { status: 400 });
  }
  const { phone } = parsed.data;

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + OTP_TTL_MS);

  await prisma.verificationToken.deleteMany({ where: { identifier: phone } });
  await prisma.verificationToken.create({
    data: { identifier: phone, token: code, expires },
  });

  // DEV ONLY — surfaces in `npm run dev` console.
  console.log(`[dev-otp] ${phone} -> ${code} (expires ${expires.toISOString()})`);

  return NextResponse.json({ ok: true, ttl: OTP_TTL_MS / 1000 });
}
