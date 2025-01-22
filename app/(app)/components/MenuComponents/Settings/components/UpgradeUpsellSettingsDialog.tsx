"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { IClipmateConnection } from "@/types/clipmate";
import { useSubscriptionContext } from "@/lib/hooks";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import ClipmatePricingDialog from "@/components/custom/ClipmatePricingDialog";
import { Rocket } from "lucide-react";
import React from "react";

type Props = {
  description?: string;
};

const UpgradeUpsellSettingsDialog = React.memo(
  ({
    description = "Upgrade to Clipmate Pro to automatically sync saved items from your favourite apps",
  }: Props) => {
    const { isPremium, isLoading } = useSubscriptionContext();

    const { user } = FireAuthHooks.useGetUser();
    const { data } = FirestoreHooks.useGetDoc<IClipmateConnection>(["users"], user.uid, {
      key: "getUserInfoForAccessControl",
    });

    return (
      <div
        className={cn(
          "hidden py-2 pr-2 pl-3 bg-secondary border dark:border-none border-[#E5E5E5] rounded-lg",
          {
            block: isPremium || !data?.is_pro,
          }
        )}
      >
        <div className="grid grid-cols-[18px_auto_100px] gap-[14px] items-center justify-between">
          <Rocket size={18} />
          <p className="text-[13px] font-medium">{description}</p>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" disabled={isLoading}>
                Upgrade
              </Button>
            </DialogTrigger>

            <ClipmatePricingDialog />
          </Dialog>
        </div>
      </div>
    );
  }
);

UpgradeUpsellSettingsDialog.displayName = "UpgradeUpsellSettingsDialog";

export default UpgradeUpsellSettingsDialog;
