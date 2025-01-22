"use client";

import ShareFolderIcon from "@/components/icons/shared-folder";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCommandKContext } from "@/lib/hooks";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import { Folder } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";

export const CommandKCollectionNavigationGroup = () => {
  const { push } = useRouter();
  const { store } = useCollectionDetailsStore();
  const { handleLevelTwo, setOpenDialog } = useCommandKContext();

  const handlePush = (id: string) => {
    push(`/collections/${id}`);
    handleLevelTwo(undefined, false);
    setOpenDialog(false);
  };

  const sorted = Object.values(store).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <CommandGroup heading="Go to ->" className="!px-2">
      {sorted.map((collection, index) => (
        <CommandItem
          className="flex gap-2 items-center h-10 aria-selected:dark:bg-[#292929] rounded-[8px]"
          key={index}
          onSelect={() => handlePush(collection._id)}
        >
          {collection.public ? <ShareFolderIcon /> : <Folder />}
          {collection.name}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default CommandKCollectionNavigationGroup;
