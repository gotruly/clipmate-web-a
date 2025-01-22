"use client";

import { Button } from "@/components/ui/button";
import FirestoreHooks from "@/app/api/hooks/firestore";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import ClipmateSynedBadge from "@/components/custom/ClipmateSyncedBadge";
import IconPicker from "@/components/custom/IconPicker";
import { IClipmateConnection } from "@/types/clipmate";
import { Loader2 } from "lucide-react";
import FireFunctionHooks from "@/app/api/hooks/firefunction";
import { toast } from "sonner";
import queryClient from "@/lib/queryClient";
import { captureException } from "@sentry/nextjs";
import ConnectionDropdown from "./ConnectionDropdown";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSubscriptionContext } from "@/lib/hooks";
import React from "react";

type Props = {
  value: { type: string; label: string; url: string; description: string };
};

const ConnectionItem = React.memo(({ value }: Props) => {
  const router = useRouter();
  const { isPremium } = useSubscriptionContext();
  const { user } = FireAuthHooks.useGetUser();
  const { data, isLoading } = FirestoreHooks.useGetDoc<IClipmateConnection>(["users"], user.uid, {
    key: "getUserInfoForAccessControl",
  });

  const { mutate: deleteSource, isPending: isDeleting } = FireFunctionHooks.useDeleteSource();
  const { mutate: syncSource, isPending: isSyncing } = FireFunctionHooks.useSyncSource();

  const handleDisconnect = () => {
    toast.loading(`Disconnecting ${value.type}`, { id: "disconnect" });

    deleteSource(
      { type: value.type },
      {
        onSuccess: () => {
          toast.dismiss("disconnect");
          toast.success("Disconnected");
          queryClient.refetchQueries({ queryKey: ["getUserInfo"] });
        },
        onError: (error) => {
          toast.dismiss("disconnect");
          toast.error("Error disconnecting source");
          captureException(error);
        },
      }
    );
  };

  const handleManualSync = () => {
    toast.loading(`Syncing ${value.type}`, { id: "sync" });

    syncSource(
      { type: value.type },
      {
        onSuccess: (res) => {
          toast.dismiss("sync");
          toast.success("Manual sync completed");
          queryClient.refetchQueries({ queryKey: ["getUserInfo"] });
        },
        onError: (error) => {
          toast.dismiss("sync");
          toast.error("Error syncing source");
          captureException(error);
        },
      }
    );
  };

  const dropdownActions = [
    {
      label: "Manual sync",
      onClick: handleManualSync,
    },
    {
      label: "Reconnect app",
      onClick: () => (window.location.href = value.url),
    },
    {
      label: "Disconnect app",
      onClick: handleDisconnect,
      isDestructive: true,
    },
  ];

  return (
    <div
      key={value.type}
      className="flex items-center justify-between border border-border rounded-xl py-2 px-3"
      data-scroll-locked={1}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-xl">
          <IconPicker type={value.type} size={24} />
        </div>

        <div>
          <p className="text-sm font-medium">{value.label}</p>
          {data && !data[value.type] && (
            <p className="text-xs text-muted-foreground">{value.description}</p>
          )}
        </div>

        {data && data[value.type] && <ClipmateSynedBadge count={data[value.type].count} />}
      </div>

      <div>
        {data && !data[value.type] && (
          <Button
            variant="outline"
            className="h-8 dark:border-[#424242]"
            disabled={isPremium || !data.is_pro}
            onClick={() => router.push(value.url)}
          >
            Connect
          </Button>
        )}

        {!isLoading &&
          data &&
          (data[value.type]?.access_token || data[value.type]?.refresh_token) && (
            <ConnectionDropdown
              actions={dropdownActions}
              isPending={isDeleting || isSyncing}
              disabled={isPremium || !data.is_pro}
            />
          )}

        {isLoading && <Loader2 size={16} className="animate-spin" />}
      </div>
    </div>
  );
});

ConnectionItem.displayName = "ConnectionItem";

export default ConnectionItem;
