"use client";

import { CommandGroup } from "@/components/ui/command";
import { CommandKMoveToTrash, CommandKRestoreFromTrash } from "./CommandKAddToCollectionItem";
import useSidebarAtom from "@/stores/SidebarStore";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import { isEmpty } from "lodash";
import MoveToTrashWrapper from "../MoveToTrashProvider";
import RestoreFromTrashWrapper from "../RestoreFromTrashProvider";
import { usePathname } from "next/navigation";

export const CommandKActionGroup = () => {
  const { item } = useSidebarAtom();
  const { selectedItems } = useMultipleItemActionAtom();

  const path = usePathname();

  return (
    <>
      {(!isEmpty(selectedItems) || item !== null) && (
        <CommandGroup heading="Actions" className="!px-2">
          <MoveToTrashWrapper value={item || undefined}>
            <CommandKMoveToTrash />
          </MoveToTrashWrapper>

          {path.includes("trash") && (
            <RestoreFromTrashWrapper value={item || undefined}>
              <CommandKRestoreFromTrash />
            </RestoreFromTrashWrapper>
          )}
        </CommandGroup>
      )}
    </>
  );
};

export default CommandKActionGroup;
