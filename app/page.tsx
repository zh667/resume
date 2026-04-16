import Link from "next/link";
import { auth, signOut } from "@/auth";
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
