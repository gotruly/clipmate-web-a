/* eslint-disable @next/next/no-img-element */
"use client";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "../ui/context-menu";
import FirestoreHooks from "@/app/api/hooks/firestore";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { IClipmateCollections } from "@/types/clipmate";
import React, { useState, useCallback } from "react"; // Import useCallback
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import {
  CheckCircle,
  Folder,
  FolderMinus,
  FolderPlus,
  Link01,
  RefreshCcw01,
  Trash04,
  XCircle,
} from "@untitled-ui/icons-react";
import { where } from "firebase/firestore";
import ClipmateInput from "./ClipmateInput";
import { isEmpty } from "lodash";
import { matchSorter } from "match-sorter";
import { Dialog, DialogTrigger } from "../ui/dialog";
import ClipmateCreateCollection from "./ClipmateCreateCollection";
import { cn, CopyToClipboard } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import AddToCollectionItem from "./clipmate-item/AddToCollectionItem";
import ToggleCollectionProvider from "@/providers/ToggleCollectionProvider";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import RemoveFromCollectionWrapper from "@/providers/RemoveFromCollectionProvider";
import MoveToTrashWrapper from "@/providers/MoveToTrashProvider";
import RestoreFromTrashWrapper from "@/providers/RestoreFromTrashProvider";
import useSidebarAtom from "@/stores/SidebarStore";
import { Command, CommandGroup, CommandInput, CommandList } from "../ui/command";
import { Button } from "../ui/button";

type Props = {
  value: any;
  url?: string;
  children: React.ReactNode;
};

const ClipmateItemContextMenu = React.memo(({ value, url, children }: Props) => {
  const path = usePathname();
  const collection = path.split("/")[2]; // This is used to get the collection id from the URL when removing item from collection

  const [searchValue, setSearchValue] = useState<string>("");
  const [subMenuOpen, setSubMenuOpen] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const { store } = useCollectionDetailsStore();
  const { selectedItems, handleSelectedItems, hasSelectedItems } = useMultipleItemActionAtom();
  const Sidebar = useSidebarAtom();

  const { user } = FireAuthHooks.useGetUser();
  const { data } = FirestoreHooks.useGetManyDocs<IClipmateCollections>(["collections"], {
    key: "getAllCollections",
    constraints: [where("user_id", "==", user.uid)],
  });

  const handleCopyLink = useCallback((v?: string) => {
    if (v) CopyToClipboard(v, { onSucess: () => toast.success("Link copied to clipboard") });
  }, []);

  const selectItem = useCallback(
    (item: any) => {
      handleSelectedItems(item);
    },
    [handleSelectedItems]
  );

  const handleSubMenuClose = useCallback((open: boolean) => {
    setSubMenuOpen(open);
    setSearchValue("");
  }, []);

  const handleOpenDialog = useCallback((open: boolean) => {
    setOpenDialog(open);
  }, []);

  const handleEscapeOnInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") handleSubMenuClose(false);
  };

  const sorted = data && data.sort((a, b) => a.name.localeCompare(b.name));
  const match = data && matchSorter(data, searchValue, { keys: ["name"] });

  return (
    <Dialog open={openDialog} onOpenChange={handleOpenDialog}>
      <ContextMenu>
        <ContextMenuTrigger disabled={Sidebar.openDialog}>
          {/* The Actual Clipmate Card = Resolved - serves as the trigger */}
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="text-sm w-[202px] rounded-lg" autoFocus={false}>
          {!path.includes("following") && (
            <>
              {!hasSelectedItems(value) && (
                <ContextMenuItem
                  className="flex items-center gap-2"
                  onClick={() => selectItem(value)}
                >
                  <CheckCircle width={16} />
                  Select
                </ContextMenuItem>
              )}

              {hasSelectedItems(value) && (
                <ContextMenuItem
                  className="flex items-center gap-2"
                  onClick={() => selectItem(value)}
                >
                  <XCircle width={16} />
                  Deselect
                </ContextMenuItem>
              )}
            </>
          )}

          {!path.includes("following") && (
            <ContextMenuSub open={subMenuOpen} onOpenChange={handleSubMenuClose}>
              <ContextMenuSubTrigger className="flex items-center gap-2 text-[13px]">
                <Folder width={16} />
                Add to Collections
              </ContextMenuSubTrigger>

              <ContextMenuSubContent
                autoFocus={true}
                sideOffset={7}
                className="p-0 w-[220px] overflow-hidden rounded-lg"
              >
                <Command autoFocus={true}>
                  <CommandInput
                    placeholder="Search"
                    value={searchValue}
                    onKeyUp={(e) => handleEscapeOnInput(e)}
                    onValueChange={(value) => setSearchValue(value)}
                    autoFocus={true}
                    className="dark:bg-background h-10"
                  />

                  <CommandList className="max-h-full dark:bg-background overflow-clip">
                    <div
                      className={cn("px-1", {
                        "border-b-[0.5px] border-border": !isEmpty(match),
                      })}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          autoFocus={false}
                          className="flex items-center rounded-sm justify-start gap-2 text-sm w-full my-1 px-2 text-[13px] hover:dark:bg-[#292929]"
                        >
                          <FolderPlus width={16} />
                          Create New Collection
                        </Button>
                      </DialogTrigger>
                    </div>

                    <CommandGroup className="max-h-full dark:bg-background overflow-auto">
                      <ScrollArea className="h-full max-h-[280px]">
                        {sorted &&
                          !isEmpty(sorted) &&
                          sorted.map((collection) => (
                            <ToggleCollectionProvider
                              key={collection._id}
                              collection={collection}
                              value={value}
                              checked={Object.keys(value.collections).some((c: string) => {
                                if (isEmpty(selectedItems)) return c === collection._id;
                                else if (!isEmpty(selectedItems)) {
                                  return selectedItems.every(
                                    (i) => i.collections && i.collections[collection._id]
                                  );
                                }
                              })}
                            >
                              <AddToCollectionItem
                                hide={match && match?.length > 0 && !match?.includes(collection)}
                              />
                            </ToggleCollectionProvider>
                          ))}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </ContextMenuSubContent>
            </ContextMenuSub>
          )}

          <ContextMenuItem
            className="flex items-center gap-2"
            onClick={() => handleCopyLink(url)}
          >
            <Link01 width={16} />
            Copy Orginal Link
          </ContextMenuItem>

          {path.includes("/collections") && !path.includes("/following") && (
            <>
              <ContextMenuSeparator />
              <RemoveFromCollectionWrapper collection={store[collection]} value={value}>
                <ContextMenuItem className="flex items-center gap-2">
                  <FolderMinus width={16} />
                  Remove from Collection
                </ContextMenuItem>
              </RemoveFromCollectionWrapper>
            </>
          )}

          <ContextMenuSeparator />

          {value.inbox === "trash" && (
            <RestoreFromTrashWrapper value={value}>
              <ContextMenuItem className="flex items-center gap-2">
                <RefreshCcw01 width={16} />
                Restore
              </ContextMenuItem>
            </RestoreFromTrashWrapper>
          )}

          {value.inbox === "default" && (
            <MoveToTrashWrapper value={value}>
              <ContextMenuItem className="flex items-center gap-2">
                <Trash04 className="!text-destructive" width={16} />
                <span className="!text-[#F97066]">Move to Trash</span>
              </ContextMenuItem>
            </MoveToTrashWrapper>
          )}
        </ContextMenuContent>
      </ContextMenu>

      <ClipmateCreateCollection setOpenDialog={handleOpenDialog} item={value} />
    </Dialog>
  );
});

ClipmateItemContextMenu.displayName = "ClipmateItemContextMenu";

export default ClipmateItemContextMenu;
