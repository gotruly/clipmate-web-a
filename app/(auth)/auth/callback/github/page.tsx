"use client";

import FireFunctionHooks from "@/app/api/hooks/firefunction";
import { useGithubOAuthCallback } from "@/app/api/hooks/oauth";
import Loading from "@/components/custom/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import FireAuthHooks from "@/app/api/hooks/fireauth";

const GithubAuthCallbackPage = () => {
  const search = useSearchParams();

  const { code } = {
    code: search.get("code") as string,
  };

  const router = useRouter();
  const CallbackAuth = useGithubOAuthCallback();
  const SyncSource = FireFunctionHooks.useSyncSource();

  const { user } = FireAuthHooks.useGetUser();

  useEffect(() => {
    CallbackAuth.mutate(
      { code },
      {
        onSuccess: (res) => {
          const { refresh_token, access_token } = res;
          SyncSource.mutate({ type: "github", access_token, refresh_token });
          router.push("/");
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div className="h-full">
      <div className="h-full w-full flex flex-col items-center justify-center">
        <div className="w-full h-[100px]">
          <Loading />
        </div>
        <p className="text-center">We are syncing your account</p>
      </div>
    </div>
  );
};

export default GithubAuthCallbackPage;
