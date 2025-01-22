"use client";

import { useKeyPress } from "@/lib/hooks";
import { Button } from "../ui/button";
import { X } from "@untitled-ui/icons-react";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import AddMultipleItemsToCollection from "./clipmate-multiselect-components/AddMultipleItemsToCollection";
import RemoveMultipleItemsToCollection from "./clipmate-multiselect-components/RemoveMultipleItemFromCollection";
import { usePathname } from "next/navigation";
import { isEmpty } from "lodash";
import DeleteMultipleItems from "./clipmate-multiselect-components/DeleteMultipleItems";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import { memo } from "react";
import RestoreMultipleItems from "./clipmate-multiselect-components/RestoreMultipleItems";
import useSidebarAtom from "@/stores/SidebarStore";

const ClipmateMultiSelect = memo(() => {
  const path = usePathname();
  const collectionId = path.split("/")[2];

  const { openDialog } = useSidebarAtom();
  const { selectedItems, resetSelectedItems } = useMultipleItemActionAtom();

  useKeyPress("Escape", () => {
    // When ever a shadcn/ui modal-like based component is open, the escape key is used to close it
    // first before we can use it to clear the selected items
    const Body = document.querySelector("body");
    const ScrollLocked = Body?.dataset["scrollLocked"];

    if (!isEmpty(selectedItems) && !ScrollLocked && !openDialog) {
      resetSelectedItems();
    }
  });

  return (
    <div className="fixed bottom-2 left-0 w-full py-4 z-50 flex justify-center pointer-events-none">
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl p-2 bg-background border border-border pointer-events-auto drop-shadow-xl",
          {
            hidden: selectedItems.length === 0,
          }
        )}
      >
        <div className="text-sm h-8 rounded-lg pl-3 pr-2 border border-dashed border-border grid grid-cols-[auto_auto] items-center justify-between gap-2">
          <span className="text-[13px]">{selectedItems.length} selected</span>
          <Button
            variant="outline"
            size="icon"
            className="w-5 h-5"
            onClick={() => resetSelectedItems()}
          >
            <X width={16} />
          </Button>
        </div>
        <Separator orientation="vertical" className="h-full" />

        <div className={cn("hidden", { block: !path.includes("trash") })}>
          <AddMultipleItemsToCollection />
        </div>

        {path.includes("collections") && (
          <div className={cn("hidden", { block: path.includes("collections") })}>
            <RemoveMultipleItemsToCollection collectionId={collectionId} />
          </div>
        )}

        <div className={cn("hidden", { block: !path.includes("trash") })}>
          <DeleteMultipleItems />
        </div>

        <div className={cn("hidden", { block: path.includes("trash") })}>
          <RestoreMultipleItems />
        </div>
      </div>
    </div>
  );
});

ClipmateMultiSelect.displayName = "ClipmateMultiSelect";

export default ClipmateMultiSelect;
