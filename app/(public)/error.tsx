"use client";

import { captureException } from "@sentry/nextjs";

export default function Error({ error }: { error: Error & { digest?: string } }) {
  captureException(error);

  return (
    <div className="w-full h-[calc(100vh-15px)] flex flex-col gap-3 items-center justify-center text-center">
      <div className="flex flex-col items-center justify-center w-full gap-3">
        <h2 className="text-xl font-semibold">Something went wrong!</h2>
        <p className="text-sm w-full max-w-[65ch] text-wrap text-gray-500">
          Ooops! We never want you to see this page. When we run into this page, we usually check
          our internet and try again, but if this persists, feel free to contact us.
        </p>
      </div>
    </div>
  );
}
