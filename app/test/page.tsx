"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RichTextEditor } from "@/components/editor/rich-text-editor";

export default function TestPage() {
  const [html, setHtml] = useState<string>(
    "<p>编辑这段文字，试试 <strong>加粗</strong> 和 <em>斜体</em></p>",
  );

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>shadcn/ui smoke test</CardTitle>
          <CardDescription>
            Verifies Button, Input, and Card render in this scaffold.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input placeholder="Type here..." />
          <Button>Click me</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>TipTap smoke test</CardTitle>
          <CardDescription>
            Bold / italic / bullet / ordered list; stays controlled.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <RichTextEditor value={html} onChange={setHtml} />
          <details className="text-xs text-zinc-500">
            <summary>Current HTML</summary>
            <pre className="mt-2 whitespace-pre-wrap break-all">{html}</pre>
          </details>
        </CardContent>
      </Card>
    </main>
  );
}
