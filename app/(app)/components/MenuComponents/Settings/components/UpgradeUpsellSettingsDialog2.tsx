"use client";

import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ClipmatePricingDialog from "@/components/custom/ClipmatePricingDialog";
import { Lightning01, Lock01 } from "@untitled-ui/icons-react";

type Props = {
  description?: string;
};

const UpgradeUpsellSettingsDialog2 = ({
  description = "Unlock all Clipmate features",
}: Props) => {
  return (
    <Dialog>
      <DialogTrigger className="w-full focus-visible:ring-0 focus-visible:outline-none">
        <div
          title="Upgrade to PRO"
          role="button"
          className="w-full grid grid-cols-[32px_auto_24px] items-center gap-2 bg-white dark:bg-background p-2 rounded-lg"
        >
          <div className="w-8 h-8 bg-[#FFCFC3] dark:bg-[#CD4D2D] text-primary dark:text-foreground rounded-full flex items-center justify-center">
            <Lightning01 width={16} fill="currentColor" />
          </div>
          <div className="grid gap-0.5 text-left text-[13px]">
            <p className="font-semibold w-fit">Upgrade to Pro</p>
            <p className="truncate text-[#A3A3A3]">{description}</p>
          </div>
          <Lock01 className="text-[#A3A3A3] dark:text-[#737373]" width={24} />
        </div>
      </DialogTrigger>

      <ClipmatePricingDialog />
    </Dialog>
  );
};

export default UpgradeUpsellSettingsDialog2;
