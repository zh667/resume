"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
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

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sentMsg, setSentMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function sendOtp() {
    setSentMsg(null);
    setErrorMsg(null);
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErrorMsg(data.error ?? "发送失败");
      return;
    }
    setSentMsg("验证码已发送（dev 模式：看服务端控制台）");
  }

  function submit() {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await signIn("credentials", {
        phone,
        code,
        redirect: false,
      });
      if (res?.error) {
        setErrorMsg("验证码错误或已过期");
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm items-center p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>
            输入手机号获取验证码（dev 模式：验证码打印在服务端控制台）
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="手机号"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={pending}
          />
          <Button type="button" variant="outline" onClick={sendOtp} disabled={pending || !phone}>
            发送验证码
          </Button>
          {sentMsg ? <p className="text-sm text-green-600">{sentMsg}</p> : null}

          <Input
            placeholder="6 位验证码"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={pending}
          />
          <Button onClick={submit} disabled={pending || !phone || !code}>
            {pending ? "登录中..." : "登录"}
          </Button>
          {errorMsg ? <p className="text-sm text-red-600">{errorMsg}</p> : null}
        </CardContent>
      </Card>
    </main>
  );
}
