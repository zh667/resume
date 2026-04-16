"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewResumePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await fetch("/api/resumes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "创建失败");
        return;
      }
      const { resume } = await res.json();
      router.push(`/resume/${resume.id}`);
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>新建简历</CardTitle>
          <CardDescription>给简历起个名字，稍后可以修改。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="简历名称，如「我的主简历」"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={pending}
          />
          <Button onClick={submit} disabled={pending || !title.trim()}>
            {pending ? "创建中..." : "创建"}
          </Button>
          {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}
