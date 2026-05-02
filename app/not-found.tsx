import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-start gap-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Not found</h1>
      <p className="text-muted-foreground">That page does not exist or was renamed.</p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
