"use client";

import React, { useState } from "react";
import {
  useCMDPress,
  useCommandKContext,
  useKeyPress,
  usePaginatedPageContext,
} from "@/lib/hooks";
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command";

import CommandKContext from "@/context/CommandKContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import CommandKLevelOne from "./components/CommandKLevelOne";
import CommandKCollectionNavigationGroup from "./components/CommandKCollectionNavigationGroup";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import useSidebarAtom from "@/stores/SidebarStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import useGlobalStore from "@/stores/GlobalStore";
import { Command } from "lucide-react";

export const CommandKAction = React.memo(() => {
  const { selectedItems } = useMultipleItemActionAtom();
  const { item } = useSidebarAtom();
  const { openDialog, setOpenDialog, search, setSearch, levelTwo, levelID, handleLevelTwo } =
    useCommandKContext();

  const handleClose = (b: boolean) => {
    setOpenDialog(b);
    if (!b) handleLevelTwo(undefined, false);
  };

  const SIZE = selectedItems.length;

  return (
    <CommandDialog open={openDialog} onOpenChange={(open) => handleClose(open)}>
      <div className={cn("px-3 pt-4 pb-1 w-fit hidden", { block: SIZE > 0 || item })}>
        {SIZE > 0 && !item && (
          <span className="flex items-center text-[13px] font-semibold px-3 py-1 bg-secondary rounded-md">
            <span>{SIZE} items</span>
          </span>
        )}

        {SIZE === 0 && item && (
          <span className="flex items-center text-[13px] font-semibold px-3 py-1 bg-secondary rounded-md">
            <span>1 item</span>
          </span>
        )}
      </div>

      <CommandInput
        placeholder="Type a Command or Search..."
        className="dark:bg-background"
        autoFocus={true}
        value={search}
        onValueChange={(value) => setSearch(value)}
      />
      <CommandList className="max-h-full dark:bg-background overflow-clip" autoFocus={true}>
        <CommandEmpty>No results found.</CommandEmpty>

        <ScrollArea className="h-full max-h-[340px] pb-1">
          {!levelTwo && <CommandKLevelOne />}
          {levelTwo && levelID === "collections" && <CommandKCollectionNavigationGroup />}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
});

CommandKAction.displayName = "CommandKAction";

const CommandKProvider = ({ children }: { children: React.ReactNode }) => {
  const { item, setReaderMode, handleOpenDialog, openDialog } = useSidebarAtom();
  const { store } = useGlobalStore();
  const data = store["getAllClipmateUnsortedItems"]?.data;

  let currentIndex = data?.findIndex((i) => i._id === item?._id) || 0;

  const { cmdDown } = useCMDPress();
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [levelID, setLevelID] = useState<string | undefined>();
  const [levelTwo, setLevelTwo] = useState<boolean>(false);

  const handleLevelTwo = (id: string | undefined, open: boolean) => {
    setSearch("");
    setLevelID(id);
    setLevelTwo(open);
  };

  const goToNext = () => {
    currentIndex = data?.findIndex((i) => i._id === item?._id) || 0;

    if (data && openDialog) {
      if (currentIndex < data.length - 1) {
        setReaderMode(false);
        handleOpenDialog(true, {
          item: data[currentIndex + 1],
          url: data[currentIndex + 1].data?.url,
        });
      }
    }
  };

  useKeyPress("k", (e) => {
    e.preventDefault();
    if (cmdDown) setOpen(true);
  });

  return (
    <CommandKContext.Provider
      value={{
        search,
        levelID,
        levelTwo,
        openDialog: open,
        setSearch,
        setLevelID,
        setLevelTwo,
        setOpenDialog: setOpen,
        handleLevelTwo,
        goToNext,
      }}
    >
      <CommandKAction />
      {children}
    </CommandKContext.Provider>
  );
};

export default CommandKProvider;
