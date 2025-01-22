"use client";

import IconPicker from "@/components/custom/IconPicker";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCommandKContext } from "@/lib/hooks";
import useSidebarAtom from "@/stores/SidebarStore";
import { Folder, Trash04 } from "@untitled-ui/icons-react";
import { Bookmark, Inbox } from "lucide-react";
import { useRouter } from "next/navigation";

export const CommandKSourcesGroup = () => {
  const { setOpenDialog, setSearch } = useCommandKContext();
  const { handleOpenDialog } = useSidebarAtom();
  const { push } = useRouter();

  const handleClose = () => {
    setSearch("");
    setOpenDialog(false);
    handleOpenDialog(false, { url: null, item: null });
  };

  const ITEM = [
    {
      icon: <IconPicker type="twitter" />,
      handleSelect: () => {
        push("/twitter");
        handleClose();
      },
      text: "X/Twitter",
    },
    {
      icon: <IconPicker type="reddit" />,
      handleSelect: () => {
        push("/reddit");
        handleClose();
      },
      text: "Reddit",
    },
    {
      icon: <IconPicker type="link" />,
      handleSelect: () => {
        push("/link");
        handleClose();
      },
      text: "Link",
    },
    {
      icon: <IconPicker type="github" />,
      handleSelect: () => {
        push("/github");
        handleClose();
      },
      text: "Github",
    },
    {
      icon: <IconPicker type="screenshot" />,
      handleSelect: () => {
        push("/screenshot");
        handleClose();
      },
      text: "Screenshots",
    },
    {
      icon: <IconPicker type="PDF" />,
      handleSelect: () => {
        push("/PDF");
        handleClose();
      },
      text: "PDF",
    },
  ];

  return (
    <CommandGroup heading="Sources" className="!px-2">
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
    </CommandGroup>
  );
};

export default CommandKSourcesGroup;
