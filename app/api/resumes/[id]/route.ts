import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: guard.userId },
    include: {
      versions: {
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      },
    },
  });
  if (!resume) {
    return NextResponse.json({ error: "简历不存在" }, { status: 404 });
  }
  return NextResponse.json({ resume });
}
