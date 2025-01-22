"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { SiApple } from "react-icons/si";
import { usePostHog } from "posthog-js/react";

type Props = {
  id: string;
  uid: string;
};

const SignInApplePublicButton = ({ id, uid }: Props) => {
  const path = usePathname();
  const posthog = usePostHog();
  const { mutate, isPending } = FireAuthHooks.useAppleSignIn();

  const handleButtonClick = () => {
    mutate(undefined, {
      onSuccess: (res) => {
        posthog.identify(res.user.uid, { info: { ...res.user, ...{ initial_url: path } } });
      },
    });
  };

  return (
    <Button
      className="!bg-white text-black flex items-center gap-3 w-full"
      onClick={() => handleButtonClick()}
    >
      {isPending ? <Loader2 className="animate-spin" size={17} /> : <SiApple size={17} />}
      Continue with Apple
    </Button>
  );
};

export default SignInApplePublicButton;
