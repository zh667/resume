import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth-guard";
import { createResumeSchema, emptyResumeContent } from "@/lib/schemas";

export async function GET() {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const resumes = await prisma.resume.findMany({
    where: { userId: guard.userId },
    orderBy: { updatedAt: "desc" },
    include: {
      versions: {
        select: { id: true, name: true, isDefault: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });
  return NextResponse.json({ resumes });
}

export async function POST(req: Request) {
  const guard = await requireUser();
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => null);
  const parsed = createResumeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "参数错误", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const { title, templateId, baseInfo } = parsed.data;

  const initialContent = {
    ...emptyResumeContent,
    basicInfo: { ...emptyResumeContent.basicInfo, ...(baseInfo ?? {}) },
  };

  const resume = await prisma.resume.create({
    data: {
      userId: guard.userId,
      title,
      baseInfo: baseInfo ?? {},
      versions: {
        create: {
          name: "默认版本",
          isDefault: true,
          templateId,
          content: initialContent,
        },
      },
    },
    include: { versions: true },
  });
  return NextResponse.json({ resume }, { status: 201 });
}
