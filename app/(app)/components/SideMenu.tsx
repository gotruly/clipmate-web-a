/* eslint-disable @next/next/no-img-element */
"use client";

import { useTheme } from "next-themes";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { redirect } from "next/navigation";
import Links from "./MenuComponents/Links";
import Collections from "./MenuComponents/Collections";
import ProfileDropdown from "./MenuComponents/ProfileDropdown";
import AddItem from "./MenuComponents/AddItem";
import Sources from "./MenuComponents/Sources";
import { ScrollArea } from "@/components/ui/scroll-area";
import UpgradeToPro from "./MenuComponents/UpgradeToPro";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { IClipmateConnection } from "@/types/clipmate";
import { cn } from "@/lib/utils";
import { useSubscriptionContext } from "@/lib/hooks";
import FollowedCollections from "./MenuComponents/FollowedCollections";
import useGlobalStore from "@/stores/GlobalStore";
import useCollectionStore from "@/stores/CollectionStore";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import useSourcesStore from "@/stores/SourcesStore";
import React from "react";

const SideMenu = React.memo(() => {
  const GlobalStore = useGlobalStore();
  const CollectionsStore = useCollectionStore();
  const CollectionDetailsStore = useCollectionDetailsStore();
  const SourceStore = useSourcesStore();

  const { user, isLoading } = FireAuthHooks.useGetUser();
  const { mutate, isPending } = FireAuthHooks.useLogOut();

  const { isPremium } = useSubscriptionContext();

  const User = FirestoreHooks.useGetDoc<IClipmateConnection>(["users"], user.uid, {
    key: "getUserInfoForAccessControl",
  });

  const { setTheme } = useTheme();

  const handleLogout = () => {
    GlobalStore.setStore({});
    CollectionsStore.setStore({});
    CollectionDetailsStore.setStore({});
    SourceStore.setStore({});

    mutate(undefined, {
      onSuccess: () => {
        redirect("/sign-in");
      },
    });
  };

  return (
    <div
      className={cn("w-full h-full flex flex-col gap-3 whitespace-nowrap relative", {
        "pb-[100px]": !User.isLoading && User.data && !User.data.is_pro,
      })}
    >
      <div className="flex items-center justify-between pr-2 pl-4 gap-3 whitespace-nowrap">
        <ProfileDropdown
          handleThemeChange={setTheme}
          user={user}
          isLoading={isLoading}
          isPending={isPending}
          isPro={User.data?.is_pro}
          handleLogout={handleLogout}
        />

        <AddItem />
      </div>

      <ScrollArea className="flex flex-col whitespace-nowrap h-full pr-1.5">
        <Links />
        <Sources />
        <Collections />
        <FollowedCollections />
      </ScrollArea>

      {/* <div className={cn("hidden", { block: isPremium || (User.data && !User.data?.is_pro) })}>
        <UpgradeToPro />
      </div> */}
    </div>
  );
});

SideMenu.displayName = "SideMenu";

export default SideMenu;
