"use client";

import SignInWithEmailForm from "../components/signWithEmailForm";
import ThirdPartySignIn from "../components/thirdPartySignIn";
import ClipmateDivider from "@/components/custom/ClipmateDivider";
import AuthTermsAndCondition from "../components/termsAndCondition";
import ClipmateIcon from "@/components/icons/clipmate";

const SignInPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-6">
        <ClipmateIcon width={40} height={40} className="rounded-xl" />
        <h1 className="text-2xl font-medium">Log in to Clipmate</h1>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <SignInWithEmailForm />
        <ClipmateDivider>or</ClipmateDivider>
        <ThirdPartySignIn />
      </div>

      <AuthTermsAndCondition />
    </div>
  );
};

export default SignInPage;
