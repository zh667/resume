import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  const resumes = user?.id
    ? await prisma.resume.findMany({
        where: { userId: user.id },
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, updatedAt: true },
      })
    : [];

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI 求职陪跑教练</CardTitle>
          <CardDescription>
            从想跳槽那一刻起，陪你走完简历 → 投递 → 面试 → Offer 全流程。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {user ? (
            <>
              <p className="text-sm">
                欢迎回来，
                <span className="font-medium">{user.name ?? user.email ?? "用户"}</span>
              </p>

              <Link href="/resume/new" className="block">
                <Button className="w-full">+ 新建简历</Button>
              </Link>

              {resumes.length > 0 ? (
                <div className="flex flex-col gap-1 rounded-md border border-zinc-200 p-2 text-sm">
                  <p className="px-1 pb-1 text-xs text-zinc-500">我的简历</p>
                  {resumes.map((r) => (
                    <Link
                      key={r.id}
                      href={`/resume/${r.id}`}
                      className="rounded px-2 py-1 hover:bg-zinc-100"
                    >
                      {r.title}
                    </Link>
                  ))}
                </div>
              ) : null}

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <Button type="submit" variant="outline" className="w-full">
                  退出登录
                </Button>
              </form>
            </>
          ) : (
            <Link href="/login" className="block">
              <Button className="w-full">登录 / 注册</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
