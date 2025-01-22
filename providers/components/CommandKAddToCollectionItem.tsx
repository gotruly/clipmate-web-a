import ShareFolderIcon from "@/components/icons/shared-folder";
import { CommandItem } from "@/components/ui/command";
import {
  useCommandKContext,
  useMoveToTrashContext,
  useRestoreFromTrashContext,
  useToggleCollectionContext,
} from "@/lib/hooks";
import useSidebarAtom from "@/stores/SidebarStore";
import { Folder, RefreshCcw01, Trash04 } from "@untitled-ui/icons-react";
import { FolderMinus } from "lucide-react";
import { usePathname } from "next/navigation";

const CommandKAddToCollectionItem = () => {
  const { collection, handleAddToCollection } = useToggleCollectionContext();
  const { handleLevelTwo, setOpenDialog, goToNext } = useCommandKContext();

  const path = usePathname();
  const isInUnsorted = path.includes("/unsorted");

  const Add = () => {
    handleAddToCollection();

    if (isInUnsorted) goToNext();

    handleLevelTwo(undefined, false);
    setOpenDialog(false);
  };

  return (
    <CommandItem
      className="flex gap-2 items-center h-10 aria-selected:dark:bg-[#292929] rounded-[8px]"
      onSelect={() => Add()}
    >
      {collection.public ? <ShareFolderIcon /> : <Folder />}
      Add to {collection.name}
    </CommandItem>
  );
};

export const CommandKRemoveFromCollectionItem = () => {
  const { handleRemoveFromCollection } = useToggleCollectionContext();
  const { setOpenDialog, setSearch } = useCommandKContext();
  const { handleOpenDialog } = useSidebarAtom();

  const Remove = () => {
    handleRemoveFromCollection();
    setSearch("");
    setOpenDialog(false);
    handleOpenDialog(false, { url: null, item: null });
  };

  return (
    <CommandItem
      className="flex gap-2 items-center h-10 aria-selected:dark:bg-[#292929] rounded-[8px]"
      onSelect={() => Remove()}
    >
      <FolderMinus />
      Remove From Collection
    </CommandItem>
  );
};

export const CommandKMoveToTrash = () => {
  const { setOpenDialog, setSearch } = useCommandKContext();
  const { handleOpenDialog } = useSidebarAtom();
  const { handleMoveToTrash } = useMoveToTrashContext();

  const MoveToTrash = () => {
    handleMoveToTrash();
    setSearch("");
    setOpenDialog(false);
    handleOpenDialog(false, { url: null, item: null });
  };

  return (
    <CommandItem
      className="flex gap-2 items-center h-10 aria-selected:dark:bg-[#292929] rounded-[8px]"
      onSelect={() => MoveToTrash()}
    >
      <Trash04 />
      Move to Trash
    </CommandItem>
  );
};

export const CommandKRestoreFromTrash = () => {
  const { setOpenDialog, setSearch } = useCommandKContext();
  const { handleOpenDialog } = useSidebarAtom();
  const { handleRestoreFromTrash } = useRestoreFromTrashContext();

  const RestoreFromTrash = () => {
    handleRestoreFromTrash();
    setSearch("");
    setOpenDialog(false);
    handleOpenDialog(false, { url: null, item: null });
  };

  return (
    <CommandItem
      className="flex gap-2 items-center h-10 aria-selected:dark:bg-[#292929] rounded-[8px]"
      onSelect={() => RestoreFromTrash()}
    >
      <RefreshCcw01 />
      Restore from Trash
    </CommandItem>
  );
};

export default CommandKAddToCollectionItem;
