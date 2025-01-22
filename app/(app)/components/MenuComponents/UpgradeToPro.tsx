import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Lightning01, Lock01 } from "@untitled-ui/icons-react";
import ClipmatePricingDialog from "@/components/custom/ClipmatePricingDialog";
import BookmarksItemsCount from "./ItemCount";
import { useState } from "react";

const UpgradeToPro = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full absolute bottom-1 left-0 px-2">
      <div className="bg-card dark:bg-secondary rounded-lg w-full flex gap-2 flex-col p-2">
        <BookmarksItemsCount />

        <Dialog open={open} onOpenChange={(b) => setOpen(b)}>
          <DialogTrigger className="focus-visible:ring-0 focus-visible:outline-none">
            <div
              title="Upgrade to PRO"
              role="button"
              className="grid grid-cols-[32px_auto_24px] items-center gap-2 bg-accent_a dark:bg-background p-2 rounded-lg"
            >
              <div className="w-8 h-8 bg-[#FFCFC3] dark:bg-[#CD4D2D] text-primary dark:text-foreground rounded-full flex items-center justify-center">
                <Lightning01 width={16} fill="currentColor" />
              </div>
              <div className="grid text-left text-[13px]">
                <p className="font-semibold w-fit">Upgrade to PRO</p>
                <p>Unlock all features</p>
              </div>
              <Lock01 className="text-[#A3A3A3] dark:text-[#737373]" width={24} />
            </div>
          </DialogTrigger>

          <ClipmatePricingDialog />
        </Dialog>
      </div>
    </div>
  );
};

export default UpgradeToPro;
