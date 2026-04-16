"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ResumeContent } from "@/lib/schemas";

interface Props {
  resumeId: string;
  resumeTitle: string;
  versionId: string;
  initialContent: ResumeContent;
}

export function ResumeEditor({
  resumeId,
  resumeTitle,
  versionId,
  initialContent,
}: Props) {
  const [content, setContent] = useState<ResumeContent>(initialContent);
  const [status, setStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [pending, startTransition] = useTransition();

  function save() {
    setStatus("saving");
    startTransition(async () => {
      const res = await fetch(
        `/api/resumes/${resumeId}/versions/${versionId}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content }),
        },
      );
      setStatus(res.ok ? "saved" : "error");
    });
  }

  function updateBasicInfo<K extends keyof ResumeContent["basicInfo"]>(
    key: K,
    value: ResumeContent["basicInfo"][K],
  ) {
    setContent((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, [key]: value },
    }));
    setStatus("idle");
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-6 p-6 md:grid-cols-2">
      {/* Left: form */}
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>{resumeTitle}</CardTitle>
              <CardDescription>基础信息</CardDescription>
            </div>
            <Button onClick={save} disabled={pending}>
              {pending
                ? "保存中..."
                : status === "saved"
                  ? "已保存 ✓"
                  : status === "error"
                    ? "保存失败"
                    : "保存"}
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <LabeledInput
              label="姓名"
              value={content.basicInfo.name ?? ""}
              onChange={(v) => updateBasicInfo("name", v)}
            />
            <LabeledInput
              label="手机号"
              value={content.basicInfo.phone ?? ""}
              onChange={(v) => updateBasicInfo("phone", v)}
            />
            <LabeledInput
              label="邮箱"
              type="email"
              value={content.basicInfo.email ?? ""}
              onChange={(v) => updateBasicInfo("email", v)}
            />
            <LabeledInput
              label="所在城市"
              value={content.basicInfo.city ?? ""}
              onChange={(v) => updateBasicInfo("city", v)}
            />
            <LabeledInput
              label="微信"
              value={content.basicInfo.wechat ?? ""}
              onChange={(v) => updateBasicInfo("wechat", v)}
            />
          </CardContent>
        </Card>
      </div>

      {/* Right: preview */}
      <div className="flex flex-col gap-4">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>预览</CardTitle>
            <CardDescription>纯文本渲染（模板在 Week 3 开发）</CardDescription>
          </CardHeader>
          <CardContent>
            <PreviewBasic basicInfo={content.basicInfo} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-600">{label}</span>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function PreviewBasic({ basicInfo }: { basicInfo: ResumeContent["basicInfo"] }) {
  const items: Array<[string, string | undefined]> = [
    ["手机号", basicInfo.phone],
    ["邮箱", basicInfo.email],
    ["城市", basicInfo.city],
    ["微信", basicInfo.wechat],
    ["LinkedIn", basicInfo.linkedin],
    ["GitHub", basicInfo.github],
  ];

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-2xl font-semibold">
        {basicInfo.name || "（未填姓名）"}
      </h2>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-zinc-700">
        {items
          .filter(([, v]) => Boolean(v))
          .map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-zinc-500">{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
    </div>
  );
}
