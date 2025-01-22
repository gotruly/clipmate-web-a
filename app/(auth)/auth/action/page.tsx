"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "../../components/resetPasswordForm";

const AuthActionPage = () => {
  const search = useSearchParams();
  const mode = search.get("mode");
  const oobCode = search.get("oobCode");

  const TextMap: Record<string, string> = {
    resetPassword: "Reset Password",
    unknown: "Unknown",
  };

  const ComponentMap: Record<string, JSX.Element> = {
    resetPassword: <ResetPasswordForm oobCode={oobCode} />,
    unknown: <div />,
  };

  const ResolvedText = TextMap[mode || "unknown"];
  const ResolvedComponent = ComponentMap[mode || "unknown"];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-6">
        <Image
          className="w-[40px] h-[40px] rounded-lg"
          src="/clipmate.svg"
          alt="Clipmate AI Logo"
          width={100}
          height={100}
          priority={true}
        />
        <h1 className="text-2xl font-medium">{ResolvedText}</h1>
      </div>

      <div className="flex flex-col gap-2 w-full">{ResolvedComponent}</div>
    </div>
  );
};

export default AuthActionPage;
