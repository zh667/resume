import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { resumeContentSchema } from "@/lib/schemas";
import { ResumeEditor } from "@/components/editor/resume-editor";

export default async function ResumePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.user.id },
    include: {
      versions: {
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      },
    },
  });
  if (!resume) notFound();

  const defaultVersion = resume.versions.find((v) => v.isDefault) ?? resume.versions[0];
  if (!defaultVersion) notFound();

  // Validate / normalize content
  const parsed = resumeContentSchema.safeParse(defaultVersion.content);
  const content = parsed.success
    ? parsed.data
    : {
        basicInfo: { name: "", phone: "", email: "" },
        education: [],
        workExperience: [],
        projectExperience: [],
        skills: { categories: [] },
      };

  return (
    <ResumeEditor
      resumeId={resume.id}
      resumeTitle={resume.title}
      versionId={defaultVersion.id}
      initialContent={content}
    />
  );
}
