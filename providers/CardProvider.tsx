/* eslint-disable @next/next/no-img-element */
"use client";

import { IClipmateBase } from "@/types/clipmate";
import { useCMDPress } from "@/lib/hooks";
import { usePathname } from "next/navigation";
import React, { useState, useCallback, useMemo } from "react"; // Import useCallback
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { isEmpty } from "lodash";
import useSidebarAtom from "@/stores/SidebarStore";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import ClipmateItemContextMenu from "@/components/custom/ClipmateItemContextMenu";

type Props = {
  url?: string;
  value: IClipmateBase;
  isLoading?: boolean;
  inPopupView?: boolean;
  children: React.ReactNode;
};

const CardProvider = React.memo(({ url, value, isLoading, children, inPopupView }: Props) => {
  const path = usePathname();
  const isNotShared = !path.includes("following");

  const { handleOpenDialog } = useSidebarAtom();
  const {
    handleSelectedItems,
    selectedItems,
    hasSelectedItems,
    setIsDragging,
    handleDraggedItems,
    resetDraggedItems,
  } = useMultipleItemActionAtom();

  const { cmdDown, shiftDown } = useCMDPress();

  const MemoizedItem = useMemo(() => value, [value]);

  const handleOpen = useCallback(() => {
    handleOpenDialog(true, { url: url || "", item: MemoizedItem });
  }, [handleOpenDialog, url, MemoizedItem]);

  const handleSidebarOpen = useCallback(() => {
    // When ever a shadcn/ui modal-like based component is open, the escape key is used to close it
    // first before we can use it to clear the selected items
    const Body = document.querySelector("body");
    const ScrollLocked = Body?.dataset["scrollLocked"];

    if (!inPopupView && !ScrollLocked) {
      if (!cmdDown && !shiftDown && isNotShared) handleOpen();
      if (!cmdDown && shiftDown && isNotShared) handleSelectedItems(MemoizedItem);
      if (cmdDown && !shiftDown) window.open(url, "_blank");
    }
  }, [
    cmdDown,
    shiftDown,
    isNotShared,
    url,
    MemoizedItem,
    inPopupView,
    handleOpen,
    handleSelectedItems,
  ]);

  const handleIndicatorPosition = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    const i = document.getElementById("multiple-indicator");
    if (!i) return;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    i.style.left = mouseX - 20 + "px";
    i.style.top = mouseY - 20 + "px";
  }, []);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      const el = document.getElementById(MemoizedItem._id) as HTMLElement;
      e.dataTransfer.setDragImage(el, 0, 0);
      setIsDragging(true);

      if (!isEmpty(selectedItems)) handleDraggedItems(selectedItems);
      else if (isEmpty(selectedItems)) handleDraggedItems([MemoizedItem]);
    },
    [MemoizedItem, setIsDragging, selectedItems, handleDraggedItems]
  );

  const handleDragEnd = useCallback(() => {
    resetDraggedItems();
    setIsDragging(false);
  }, [resetDraggedItems, setIsDragging]);

  const draggable =
    (hasSelectedItems(MemoizedItem) || isEmpty(selectedItems)) && isNotShared && !inPopupView;

  return (
    <Card
      id={MemoizedItem._id}
      draggable={draggable}
      onDragCapture={(e) => handleIndicatorPosition(e)}
      onDragStart={(e) => handleDragStart(e)}
      onDragEnd={() => handleDragEnd()}
      className={cn(
        "bg-white dark:bg-card px-0 w-full h-fit pointer-events-auto cursor-default border-[0.5px] hover:!bg-secondary hover:border-input transition-colors relative select-none overflow-hidden rounded-[12px]",
        {
          "hover:!bg-white hover:dark:!bg-card border-none select-text": inPopupView,
          "!bg-secondary border-input": hasSelectedItems(MemoizedItem) && !inPopupView,
          "pointer-events-none cursor-progress": isLoading && !url,
        }
      )}
      onClick={() => handleSidebarOpen()}
    >
      <ClipmateItemContextMenu value={MemoizedItem} url={url}>
        {children}
      </ClipmateItemContextMenu>
    </Card>
  );
});

CardProvider.displayName = "CardProvider";

export default CardProvider;
