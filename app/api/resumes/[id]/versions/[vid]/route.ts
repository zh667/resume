import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { updateVersionSchema } from "@/lib/schemas";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string; vid: string }> },
) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { id, vid } = await params;

  // Ownership check
  const existing = await prisma.resumeVersion.findFirst({
    where: { id: vid, resumeId: id, resume: { userId: guard.userId } },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "版本不存在" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateVersionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "参数错误", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const version = await prisma.resumeVersion.update({
    where: { id: vid },
    data: parsed.data,
  });
  return NextResponse.json({ version });
}
