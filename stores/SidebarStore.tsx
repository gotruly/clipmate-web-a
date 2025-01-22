import { IClipmateResponse } from "@/types/clipmate";
import { atom, useAtom } from "jotai";
import { useCallback } from "react";

export type HandleOpenType = { url: string | null; item: IClipmateResponse | null };

const SidebarAtom = atom<boolean>(false);
const SidebarOpenDropdownAtom = atom<boolean>(false);
const SidebarValueAtom = atom<IClipmateResponse | null>(null);
const SidebarUrlAtom = atom<string | null>(null);
const SidebarOpenDialogAtom = atom<boolean>(false);
const ReaderMode = atom<boolean>(false);
const CollectionsOpen = atom<boolean>(false);
const HoverOnTrigger = atom<boolean>(false);

const useSidebarAtom = () => {
  const [open, setOpen] = useAtom(SidebarAtom);
  const [openDropdown, setOpenDropdown] = useAtom(SidebarOpenDropdownAtom);
  const [item, setItem] = useAtom(SidebarValueAtom);
  const [url, setUrl] = useAtom(SidebarUrlAtom);
  const [openDialog, setOpenDialog] = useAtom(SidebarOpenDialogAtom);
  const [readerMode, setReaderMode] = useAtom(ReaderMode);
  const [collectionsOpen, setCollectionsOpen] = useAtom(CollectionsOpen);
  const [hoverOnTrigger, setHoverOnTrigger] = useAtom(HoverOnTrigger);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleToggleReaderMode = useCallback(() => {
    setReaderMode((prev) => !prev);
  }, [setReaderMode]);

  const handleOpenDialog = useCallback(
    (open: boolean, { url, item }: HandleOpenType) => {
      setOpenDialog(open);
      setOpen(true);
      setItem(item);
      setUrl(url);
    },
    [setOpenDialog, setOpen, setItem, setUrl]
  );

  const isInPopupView = useCallback(
    (value: IClipmateResponse) => {
      return item?._id === value._id;
    },
    [item?._id]
  );

  return {
    open,
    openDropdown,
    item,
    url,
    openDialog,
    readerMode,
    collectionsOpen,
    hoverOnTrigger,
    setItem,
    setOpen,
    setOpenDropdown,
    setUrl,
    setReaderMode,
    setCollectionsOpen,
    setHoverOnTrigger,
    handleOpen,
    handleClose,
    handleOpenDialog,
    handleToggleReaderMode,
    isInPopupView,
  };
};

export default useSidebarAtom;
