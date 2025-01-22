import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { usePaginatedPageContext } from "@/lib/hooks";
import { IClipmateBase } from "@/types/clipmate";
import { isEmpty } from "lodash";
import { toast } from "sonner";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import { captureException } from "@sentry/nextjs";
import useGlobalStore from "@/stores/GlobalStore";
import MoveToTrashContext from "@/context/MoveToTrashContext";

type Props = {
  value?: IClipmateBase;
  children: React.ReactNode;
};

const MoveToTrashWrapper = ({ value, children }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { selectedItems, resetSelectedItems } = useMultipleItemActionAtom();
  const { handleRealtimeAddItemToPair, handleDeleteItemFromPair } = useGlobalStore();
  const { identifier } = usePaginatedPageContext();

  const size = selectedItems.length;

  const MoveToTrash = FirestoreHooks.useMoveToTrash(["users", user.uid, "bookmarks"], {
    key: "moveItemsToTrash",
  });

  const handleMoveToTrash = () => {
    if (!isEmpty(selectedItems)) {
      handleRealtimeAddItemToPair("getAllClipmateTrashItems", selectedItems);
      handleDeleteItemFromPair(
        identifier,
        selectedItems.map((i) => i._id)
      );

      toast.success(`${size} item(s) moved to trash`);
      MoveToTrash.mutate({ params: selectedItems });

      resetSelectedItems();
    } else if (value) {
      handleRealtimeAddItemToPair("getAllClipmateTrashItems", [value]);
      handleDeleteItemFromPair(identifier, [value._id]);
      toast.success("Moved to trash");

      MoveToTrash.mutate({ params: [value] });
    }
  };

  return (
    <MoveToTrashContext.Provider value={{ handleMoveToTrash }}>
      <div onClick={() => handleMoveToTrash()}>{children}</div>
    </MoveToTrashContext.Provider>
  );
};

export default MoveToTrashWrapper;
