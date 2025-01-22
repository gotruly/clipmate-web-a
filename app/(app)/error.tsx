"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import FireAuthHooks from "../api/hooks/fireauth";
import { captureException } from "@sentry/nextjs";

export default function Error({
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
    <div className="w-full h-[calc(100vh-15px)] border border-border rounded-md flex flex-col gap-3 items-center justify-center text-center">
      <div className="flex flex-col items-center justify-center w-full gap-3">
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
        <p className="text-sm w-full max-w-[65ch] text-wrap text-gray-500">
          Ooops! We never want you to see this page. When we run into this page, we usually check
          our internet and try again, but if this persists, feel free to contact us.
        </p>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => reset()}>
            Try again
          </Button>
          <Button onClick={() => mutate()}>Log out</Button>
        </div>
      </div>
    </div>
  );
}
