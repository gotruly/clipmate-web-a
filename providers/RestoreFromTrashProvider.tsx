import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { usePaginatedPageContext } from "@/lib/hooks";
import { IClipmateBase } from "@/types/clipmate";
import { isEmpty } from "lodash";
import { toast } from "sonner";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import { captureException } from "@sentry/nextjs";
import useGlobalStore from "@/stores/GlobalStore";
import RestoreFromTrashContext from "@/context/RestoreFromTrashContext";

type Props = {
  value?: IClipmateBase;
  children: React.ReactNode;
};

const RestoreFromTrashWrapper = ({ value, children }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { selectedItems, resetSelectedItems } = useMultipleItemActionAtom();
  const { handleRealtimeAddItemToPair, handleDeleteItemFromPair } = useGlobalStore();
  const { identifier } = usePaginatedPageContext();

  const size = selectedItems.length;

  const RestoreFromTrash = FirestoreHooks.useRestoreFromTrash(["users", user.uid, "bookmarks"], {
    key: "restoreItemsFromTrash",
  });

  const handleRestoreFromTrash = () => {
    if (!isEmpty(selectedItems)) {
      handleDeleteItemFromPair(
        "getAllClipmateTrashItems",
        selectedItems.map((i) => i._id)
      );

      toast.success(`${size} item(s) restored successfully`);
      RestoreFromTrash.mutate({ params: selectedItems });

      resetSelectedItems();
    } else if (value) {
      handleDeleteItemFromPair("getAllClipmateTrashItems", [value._id]);
      toast.success("Restored successfully");

      RestoreFromTrash.mutate({ params: [value] });
    }
  };

  return (
    <RestoreFromTrashContext.Provider value={{ handleRestoreFromTrash }}>
      <div onClick={() => handleRestoreFromTrash()}>{children}</div>
    </RestoreFromTrashContext.Provider>
  );
};

export default RestoreFromTrashWrapper;
