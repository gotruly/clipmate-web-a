"use client";

import { CommandGroup, CommandItem } from "@/components/ui/command";
import { useCommandKContext } from "@/lib/hooks";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React from "react";

export const CommandKThemeGroup = React.memo(() => {
  const { setOpenDialog, setSearch } = useCommandKContext();
  const { setTheme } = useTheme();

  const handleClose = () => {
    setSearch("");
    setOpenDialog(false);
  };

  const ITEM = [
    {
      icon: <Sun />,
      handleSelect: () => {
        setTheme("light");
        handleClose();
      },
      text: "Change to Light Mode",
    },
    {
      icon: <Moon />,
      handleSelect: () => {
        setTheme("dark");
        handleClose();
      },
      text: "Change to Dark Mode",
    },
  ];

  return (
    <CommandGroup heading="Theme" className="!px-2">
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
});

CommandKThemeGroup.displayName = "CommandKThemeGroup";

export default CommandKThemeGroup;
