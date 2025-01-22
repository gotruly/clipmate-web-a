import { IClipmateBase } from "@/types/clipmate";
import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";

const ItemAtom = atom<IClipmateBase[]>([]);
const DraggedItemAtom = atom<IClipmateBase[]>([]);
const isDraggingAtom = atom<boolean>(false);
const checkModeAtom = atom<boolean>(false);

const useMultipleItemActionAtom = () => {
  const [checkMode, setCheckMode] = useAtom(checkModeAtom);
  const [selectedItems, setSelectedItems] = useAtom(ItemAtom);
  const [draggedItems, setDraggedItems] = useAtom(DraggedItemAtom);
  const [isDragging, setIsDragging] = useAtom(isDraggingAtom);

  const handleSelectedItems = useCallback(
    (item: IClipmateBase) => {
      setSelectedItems((prev) => {
        if (prev.some((i) => i._id === item._id)) {
          return prev.filter((i) => i._id !== item._id);
        } else return [...prev, item];
      });
    },
    [setSelectedItems]
  );

  const handleDraggedItems = useCallback(
    (items: IClipmateBase[]) => {
      setDraggedItems([...items]);
    },
    [setDraggedItems]
  );

  const resetSelectedItems = useCallback(() => {
    setSelectedItems([]);
  }, [setSelectedItems]);

  const resetDraggedItems = useCallback(() => {
    setDraggedItems([]);
  }, [setDraggedItems]);

  const MemoizedSelectedItem = useMemo(() => selectedItems, [selectedItems]);
  const MemoizedDraggedItem = useMemo(() => draggedItems, [draggedItems]);
  const MemoizedIsDragging = useMemo(() => isDragging, [isDragging]);

  const hasSelectedItems = useCallback(
    (item: IClipmateBase) => {
      return MemoizedSelectedItem.some((i) => i._id === item._id);
    },
    [MemoizedSelectedItem]
  );

  return {
    selectedItems: MemoizedSelectedItem,
    draggedItems: MemoizedDraggedItem,
    isDragging: MemoizedIsDragging,
    checkMode,
    setCheckMode,
    setIsDragging,
    setSelectedItems,
    setDraggedItems,
    handleSelectedItems,
    handleDraggedItems,
    hasSelectedItems,
    resetSelectedItems,
    resetDraggedItems,
  };
};

export default useMultipleItemActionAtom;
