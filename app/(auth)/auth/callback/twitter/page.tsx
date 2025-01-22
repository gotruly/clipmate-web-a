"use client";

import FireFunctionHooks from "@/app/api/hooks/firefunction";
import { useTwitterOAuthCallback } from "@/app/api/hooks/oauth";
import Loading from "@/components/custom/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const TwitterAuthCallbackPage = () => {
  const search = useSearchParams();

  const { code, state } = {
    code: search.get("code") as string,
    state: search.get("state") as string,
  };

  const router = useRouter();
  const CallbackAuth = useTwitterOAuthCallback();
  const SyncSource = FireFunctionHooks.useSyncSource();

  useEffect(() => {
    CallbackAuth.mutate(
      { code, state },
      {
        onSuccess: (res) => {
          const { refresh_token, access_token } = res;
          SyncSource.mutate({ type: "twitter", access_token, refresh_token });
          router.push("/");
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, state]);

  return (
    <div className="h-full">
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="w-full h-[100px]">
          <Loading />
        </div>
        <p className="text-center text-sm">We are syncing your account</p>
      </div>
    </div>
  );
};

export default TwitterAuthCallbackPage;
