import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TestPage() {
  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-8">
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
    </main>
  );
}
