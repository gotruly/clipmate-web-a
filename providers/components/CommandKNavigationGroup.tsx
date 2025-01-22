"use client";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCommandKContext } from "@/lib/hooks";
import useSidebarAtom from "@/stores/SidebarStore";
import { Folder, Trash04 } from "@untitled-ui/icons-react";
import { Bookmark, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";

export const CommandKNavigationGroup = () => {
  const { setOpenDialog, setSearch, handleLevelTwo } = useCommandKContext();
  const { handleOpenDialog } = useSidebarAtom();
  const { push } = useRouter();

  const handleClose = () => {
    setSearch("");
    setOpenDialog(false);
    handleOpenDialog(false, { url: null, item: null });
  };

  const ITEM = [
    {
      icon: <Bookmark />,
      handleSelect: () => {
        push("/");
        handleClose();
      },
      text: "All Items",
    },
    {
      icon: <Inbox />,
      handleSelect: () => {
        push("/unsorted");
        handleClose();
      },
      text: "Unsorted",
    },
    {
      icon: <Trash04 />,
      handleSelect: () => {
        push("/trash");
        handleClose();
      },
      text: "Trash",
    },
    {
      icon: <Folder />,
      handleSelect: () => handleLevelTwo("collections", true),
      text: "Collections",
    },
  ];

  return (
    <CommandGroup heading="Navigation" className="!px-2">
      {ITEM.map((item, index) => (
        <CommandItem
          className="flex gap-2 items-center h-10 aria-selected:dark:bg-[#292929] rounded-[8px]"
          key={index}
          onSelect={() => {
            item.handleSelect();
          }}
        >
          {item.icon}
          {item.text}
        </CommandItem>
      ))}
    </CommandGroup>
  );
};

export default CommandKNavigationGroup;
