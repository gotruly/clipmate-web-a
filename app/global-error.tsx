"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import FireAuthHooks from "./api/hooks/fireauth";
import { captureException } from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { mutate } = FireAuthHooks.useLogOut();

  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center text-center">
      <h2>Something went wrong!</h2>
      <p className="text-sm">
        This error has been report to Clipmate and we are working to solve this issue, if this
        issue persists, contact us
      </p>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={() => reset()}>
          Try again
        </Button>
        <Button onClick={() => mutate()}>Log out</Button>
      </div>
    </div>
  );
}
