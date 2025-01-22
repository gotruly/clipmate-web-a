import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import SignInGooglePublicButton from "./signWithGoogleButton";
import SignInApplePublicButton from "./signWithAppleButton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ClipmateIcon from "@/components/icons/clipmate";

type Props = {
  id: string;
  uid: string;
};

const PublicSignInDialog = ({ id, uid }: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="rounded-full">Follow</Button>
      </DialogTrigger>
      <DialogContent className="bg-black p-0 max-w-[400px]">
        <div className="bg-public-sign-in bg-cover bg-no-repeat w-full h-full flex flex-col items-center justify-center gap-8 p-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <ClipmateIcon className="rounded-lg" width={40} height={40} />
            <div className="grid gap-2">
              <h1 className="text-3xl font-medium">
                Zero-Effort <br />
                AI Bookmark Manager
              </h1>
              <p className="text-xs text-zinc-300">
                Multimodal search for your all bookmarks, links and screenshots
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <SignInGooglePublicButton id={id} uid={uid} />
            <SignInApplePublicButton id={id} uid={uid} />
          </div>

          <div className="flex items-center justify-center gap-1 w-full text-zinc-400">
            <p className="text-xs text-center leading-4.5">
              By creating an account, you agree to the{" "}
              <Link
                href="https://clipmate.ai/terms-and-conditions"
                target="_blank"
                className="underline text-white"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="https://clipmate.ai/privacy-policy"
                target="_blank"
                className="underline text-white"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublicSignInDialog;
