"use client";

import ForgotPasswordForm from "../components/forgotPasswordForm";
import ClipmateDivider from "@/components/custom/ClipmateDivider";
import ClipmateIcon from "@/components/icons/clipmate";

const ForgotPasswordPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-6">
        <ClipmateIcon className="rounded-lg" width={40} height={40} />
        <h1 className="text-2xl font-medium">Reset Password</h1>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <ForgotPasswordForm />
        <ClipmateDivider>Note</ClipmateDivider>
        <p className="text-xs text-muted-foreground text-center">
          If you have an account associated with this email address, you&apos;ll recieve an email
          with password rest instructions.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
