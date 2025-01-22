"use client";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCollectionsContext, useCommandKContext } from "@/lib/hooks";
import { FolderPlus } from "@untitled-ui/icons-react";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import useSidebarAtom from "@/stores/SidebarStore";
import { usePathname } from "next/navigation";
import ToggleCollectionProvider from "../ToggleCollectionProvider";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import { isEmpty } from "lodash";
import { CommandKRemoveFromCollectionItem } from "./CommandKAddToCollectionItem";

export const CommandKCollectionGroup = () => {
  const { item } = useSidebarAtom();
  const { store } = useCollectionDetailsStore();
  const { setOpenDialog } = useCollectionsContext();
  const CMDK = useCommandKContext();
  const { selectedItems } = useMultipleItemActionAtom();

  const path = usePathname();
  const collection = path.split("/")[2]; // This is used to get the collection id from the URL when removing item from collection

  const SHOW_REMOVE = !isEmpty(selectedItems) || item;

  const ITEM = [
    {
      icon: <FolderPlus />,
      handleSelect: () => {
        setOpenDialog(true);
        CMDK.setSearch("");
        CMDK.setOpenDialog(false);
      },
      text: "Create New Collection",
    },
  ];

  return (
    <CommandGroup heading="Collection" className="!px-2">
      {ITEM.map((item, index) => (
        <CommandItem
          className="flex gap-2 items-center h-10 aria-selected:dark:bg-[#292929] rounded-[8px]"
          key={index}
          onSelect={() => item.handleSelect()}
        >
          {item.icon}
          {item.text}
        </CommandItem>
      ))}

      {path.includes("/collections") && SHOW_REMOVE && (
        <ToggleCollectionProvider
          collection={store[collection]}
          value={item || undefined}
          checked={false}
        >
          <CommandKRemoveFromCollectionItem />
        </ToggleCollectionProvider>
      )}
    </CommandGroup>
  );
};

export default CommandKCollectionGroup;
