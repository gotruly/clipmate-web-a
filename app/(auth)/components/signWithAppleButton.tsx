"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { SiApple } from "react-icons/si";
import { usePostHog } from "posthog-js/react";

const SignInAppleButton = () => {
  const router = useRouter();
  const path = usePathname();
  const posthog = usePostHog();
  const { mutate, isPending } = FireAuthHooks.useAppleSignIn();

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
      {isPending ? <Loader2 className="animate-spin" size={17} /> : <SiApple size={17} />}
      Continue with Apple
    </Button>
  );
};

export default SignInAppleButton;
