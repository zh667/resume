import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "未登录" }, { status: 401 }),
    };
  }
  return { userId: session.user.id };
}
