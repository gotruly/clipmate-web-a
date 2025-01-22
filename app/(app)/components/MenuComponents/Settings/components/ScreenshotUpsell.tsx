import { Button } from "@/components/ui/button";
import Link from "next/link";
import IconPicker from "@/components/custom/IconPicker";
import { IOS_APP_STORE_URL } from "@/constants";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import MockQRCode from "@/components/icons/mock-qr-code";
import { Scan } from "@untitled-ui/icons-react";
import AndroidIcon from "@/components/icons/android";
import DashedLine from "@/components/icons/dashed";

const ScreenshotUpsell = () => {
  const value = {
    type: "screenshot",
    label: "Screenshots",
    url: IOS_APP_STORE_URL,
    description: "Sync your saved screenshots automatically",
  };

  return (
    <div
      key={value.type}
      className="flex items-center justify-between border border-border rounded-xl py-2 px-3"
      data-scroll-locked={1}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl">
          <IconPicker type={value.type} size={28} />
        </div>

        <div>
          <p className="text-sm font-medium">{value.label}</p>
          <p className="text-xs text-muted-foreground">{value.description}</p>
        </div>
      </div>

      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-8 dark:border-[#424242]">
              Connect
            </Button>
          </DialogTrigger>
          <DialogContent className="focus-visible:outline-none focus-visible:ring-0 max-w-[468px]">
            <div className="flex flex-col gap-2 justify-center items-center text-center">
              {/** Heading */}
              <div className="grid gap-2">
                <p className="text-base font-semibold">Screenshot Integrations</p>
                <p className="text-sm text-muted-foreground dark:text-[#A3A3A3]">
                  Screenshot integrations are only available in the Clipmate iOS app. Download it
                  by scanning the QR code or searching &apos;Clipmate AI&apos; in the App Store
                </p>
              </div>

              {/** QR Code */}
              <div className="flex flex-col gap-2 justify-center items-center py-7">
                <div className="bg-background border border-border rounded-lg p-3 w-fit">
                  <MockQRCode width={148} height={148} />
                </div>
              </div>

              {/** Supporting Texts */}
              <div className="flex flex-col gap-3 justify-center items-center text-center w-fit">
                <div className="text-sm font-semibold flex gap-2 items-center w-fit">
                  <Scan width={20} fill="currentColor" stroke="currentColor" />
                  <span>Scan to Download</span>
                </div>
                <p className="text-sm text-muted-foreground w-fit">
                  Search{" "}
                  <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#F49062] to-primary">
                    &apos;Clipmate AI&apos;
                  </span>{" "}
                  in the App Store
                </p>
              </div>

              <DashedLine
                width="100%"
                height="2"
                className="text-muted-foreground dark:text-[#424242] my-5"
              />

              {/** Request Android */}
              <div className="flex gap-2 justify-between items-center text-center w-full">
                <p className="text-sm text-muted-foreground font-medium flex gap-2 items-center w-fit">
                  Are you an Android user?
                </p>
                <Button size="sm" variant="outline" className="gap-2 items-center" asChild>
                  <Link href="mailto:hello@clipmate.ai">
                    <AndroidIcon width={16} height={16} />
                    Request Android App
                  </Link>
                </Button>
              </div>
              {/** */}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ScreenshotUpsell;
