import { IClipmateResponse } from "@/types/clipmate";
import ClipmateKeyboardShortcut from "../ClipmateKeyboardShortcut";
import { useCMDPress, useKeyPress, usePaginatedPageContext } from "@/lib/hooks";
import { toast } from "sonner";
import useSidebarAtom from "@/stores/SidebarStore";
import FirestoreHooks from "@/app/api/hooks/firestore";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import useGlobalStore from "@/stores/GlobalStore";
import FullViewClipmateCollectionsDropdown from "./FullViewClipmateCollectionsDropdown";

type Props = {
  item: IClipmateResponse;
  url: string;
};

const FullPostNavigation = ({ item, url }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const {
    collectionsOpen,
    hoverOnTrigger,
    handleOpenDialog,
    setReaderMode,
    handleToggleReaderMode,
    setCollectionsOpen,
  } = useSidebarAtom();
  const { handleRealtimeAddItemToPair, handleDeleteItemFromPair } = useGlobalStore();
  const { displayData, setCursor, isFetching, identifier } = usePaginatedPageContext();
  const { data, count, lastVisible } = displayData;

  const { mutate } = FirestoreHooks.useMoveToTrash(["users", user.uid, "bookmarks"], {
    key: "moveItemsToTrash",
  });
  const RestoreFromTrash = FirestoreHooks.useRestoreFromTrash(["users", user.uid, "bookmarks"], {
    key: "restoreItemsFromTrash",
  });

  let currentIndex = data?.findIndex((i) => i._id === item._id) || 0;
  const isLink = item.type === "link";
  const isInTrash = item.inbox === "trash";

  const handleLeft = () => {
    currentIndex = data?.findIndex((i) => i._id === item._id) || 0;

    if (data && !isFetching) {
      if (currentIndex > 0) {
        setReaderMode(false);
        handleOpenDialog(true, {
          item: data[currentIndex - 1],
          url: data[currentIndex - 1].data?.url,
        });
      } else if (currentIndex === 0) {
        toast.info("You've reached the beginning");
      }
    }
  };

  const handleRight = () => {
    currentIndex = data?.findIndex((i) => i._id === item._id) || 0;

    if (data && !isFetching) {
      if (currentIndex < data.length - 1) {
        setReaderMode(false);
        handleOpenDialog(true, {
          item: data[currentIndex + 1],
          url: data[currentIndex + 1].data?.url,
        });
      } else if (currentIndex === data.length - 1) {
        if (data.length < count) {
          setCursor(lastVisible);
          toast.info("Loaded more items...");
        } else toast.info("You've reached the end");
      }
    }
  };

  const openInNewTab = () => {
    currentIndex = data?.findIndex((i) => i._id === item._id) || 0;

    if (data) {
      if (url) window.open(url, "_blank");
    }
  };

  const moveToTrash = () => {
    if (isInTrash) return;

    handleRealtimeAddItemToPair("getAllClipmateTrashItems", [item]);
    handleDeleteItemFromPair(identifier, [item._id]);
    handleOpenDialog(false, { item: null, url: null });
    handleRight();

    toast.success("Move to Trash");

    mutate(
      { params: [item] },
      {
        onSuccess: (res) => {},
        onError: () => {
          toast.error("Failed to delete item");
        },
      }
    );
  };

  const restoreFromTrash = () => {
    if (!isInTrash) return;

    handleDeleteItemFromPair("getAllClipmateTrashItems", [item._id]);
    handleOpenDialog(false, { item: null, url: null });
    toast.success("Restored successfully");

    RestoreFromTrash.mutate(
      { params: [item] },
      {
        onSuccess: () => {},
        onError: () => {
          toast.error("Failed to delete item");
        },
      }
    );
  };

  const handleCloseDialog = () => {
    setReaderMode(false);
    handleOpenDialog(false, { item: null, url: null });
  };

  useKeyPress("ArrowLeft", (e) => {
    e.preventDefault();
    handleLeft();
  });

  useKeyPress("ArrowRight", (e) => {
    e.preventDefault();
    handleRight();
  });

  useKeyPress("o", (e) => {
    e.preventDefault();
    openInNewTab();
  });

  useKeyPress("Backspace", (e) => {
    e.preventDefault();
    moveToTrash();
  });

  useKeyPress("+", (e) => {
    e.preventDefault();
    restoreFromTrash();
  });

  useKeyPress("r", (e) => {
    e.preventDefault();
    if (item.type === "link") handleToggleReaderMode();
  });

  useKeyPress("Escape", (e) => {
    e.preventDefault();
    if (!collectionsOpen) handleCloseDialog();
  });

  const { cmdDown } = useCMDPress();

  useKeyPress("i", (e) => {
    e.preventDefault();
    if (cmdDown) setCollectionsOpen(!collectionsOpen);
  });

  return (
    <div className="w-fit flex items-center bg-white dark:bg-background gap-1 rounded-lg py-1 px-1 border border-border">
      <ClipmateKeyboardShortcut keys={["<-"]} text="Previous" onClick={() => handleLeft()} />
      <ClipmateKeyboardShortcut keys={["->"]} text="Next" onClick={() => handleRight()} />
      <ClipmateKeyboardShortcut keys={["O"]} text="Open Link" onClick={() => openInNewTab()} />
      <ClipmateKeyboardShortcut
        keys={["R"]}
        text="Toggle Reader Mode"
        onClick={() => handleToggleReaderMode()}
        hidden={!isLink}
      />

      <FullViewClipmateCollectionsDropdown
        disabled={isInTrash || (!collectionsOpen && !hoverOnTrigger)}
        handleNext={() => identifier === "getAllClipmateUnsortedItems" && handleRight()}
      />

      <ClipmateKeyboardShortcut
        keys={["⌫"]}
        text="Move to Trash"
        onClick={() => moveToTrash()}
        hidden={isInTrash}
      />
      <ClipmateKeyboardShortcut
        keys={["+"]}
        text="Restore"
        onClick={() => restoreFromTrash()}
        hidden={!isInTrash}
      />
      <ClipmateKeyboardShortcut keys={["Esc"]} text="Close" onClick={() => handleCloseDialog()} />
    </div>
  );
};

export default FullPostNavigation;
