"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import GoogleIcon from "@/components/icons/google";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";

const SignInGoogleButton = () => {
  const router = useRouter();
  const path = usePathname();
  const posthog = usePostHog();
  const { mutate, isPending } = FireAuthHooks.useGoogleSignIn();

  const handleButtonClick = () => {
    mutate(undefined, {
      onSuccess: (res) => {
        posthog.identify(res.user.uid, { info: { ...res.user, ...{ initial_url: path } } });
        router.push("/");
      },
    });
  };

  return (
    <Button
      variant="secondary"
      className="flex items-center gap-3 w-full"
      onClick={() => handleButtonClick()}
    >
      {isPending ? (
        <Loader2 className="animate-spin" size={17} />
      ) : (
        <GoogleIcon height={17} width={17} />
      )}
      Continue with Google
    </Button>
  );
};

export default SignInGoogleButton;
