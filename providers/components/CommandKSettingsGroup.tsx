"use client";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCommandKContext } from "@/lib/hooks";
import useSettingsModalAtom from "@/stores/SettingsModalStore";
import { Home05, Link04 } from "@untitled-ui/icons-react";

export const CommandKSettingsGroup = () => {
  const { setOpenDialog, setSearch } = useCommandKContext();
  const { setTab, setOpen } = useSettingsModalAtom();

  const handleClose = () => {
    setSearch("");
    setOpenDialog(false);
  };

  const ITEM = [
    {
      icon: <Home05 />,
      handleSelect: () => {
        setOpen(true);
        setTab("account");
        handleClose();
      },
      text: "Account",
    },
    {
      icon: <Link04 />,
      handleSelect: () => {
        setOpen(true);
        setTab("connection");
        handleClose();
      },
      text: "App Connections",
    },
  ];

  return (
    <CommandGroup heading="Settings" className="!px-2">
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

export default CommandKSettingsGroup;
