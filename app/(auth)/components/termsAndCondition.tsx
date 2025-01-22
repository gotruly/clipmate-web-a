import Link from "next/link";

const AuthTermsAndCondition = () => {
  return (
    <div className="flex items-center justify-center gap-1 w-full ">
      <p className="text-xs text-center text-muted-foreground leading-4.5">
        By creating an account, you agree to the{" "}
        <Link
          href="https://clipmate.ai/terms-and-conditions"
          target="_blank"
          className="underline dark:text-white text-black"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="https://clipmate.ai/privacy-policy"
          target="_blank"
          className="underline dark:text-white text-black"
        >
          Privacy Policy
        </Link>
      </p>
    </div>
  );
};

export default AuthTermsAndCondition;
