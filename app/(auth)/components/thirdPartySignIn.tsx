import SignInAppleButton from "./signWithAppleButton";
import SignInGoogleButton from "./signWithGoogleButton";

const ThirdPartySignIn = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <SignInGoogleButton />
      <SignInAppleButton />
    </div>
  );
};

export default ThirdPartySignIn;
