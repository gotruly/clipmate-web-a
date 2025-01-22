import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { usePaginatedPageContext } from "@/lib/hooks";
import { IClipmateCollections, IClipmateResponse } from "@/types/clipmate";
import { isEmpty } from "lodash";
import { toast } from "sonner";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import useCollectionStore from "@/stores/CollectionStore";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import { useCallback } from "react";

type Props = {
  value?: IClipmateResponse;
  collection: IClipmateCollections;
  children: React.ReactNode;
};

const RemoveFromCollectionWrapper = ({ value, collection, children }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { selectedItems, resetSelectedItems } = useMultipleItemActionAtom();
  const { handleRemoveCollectionFromPairItem, handleDeleteItemFromPair } = useCollectionStore();

  const { store } = useCollectionDetailsStore();
  const { identifier } = usePaginatedPageContext();

  const Remove = FirestoreHooks.useDeleteManyBookmarksToCollection(
    ["users", user.uid, "bookmarks"],
    { key: "removeManyItemsFromCollection" }
  );

  const EditCollection = FirestoreHooks.useEditDoc<IClipmateCollections>(
    ["collections"],
    collection._id,
    { key: `edit_${collection._id}` }
  );

  const size = selectedItems.length;

  const handleRemoveFromCollection = useCallback(() => {
    const { _id, ...rest } = collection;

    if (!isEmpty(selectedItems)) {
      EditCollection.mutate({ ...rest, count: store[collection._id].count - size });

      handleRemoveCollectionFromPairItem(
        identifier,
        collection._id,
        selectedItems.map((i) => i._id)
      );
      handleRemoveCollectionFromPairItem(
        collection._id,
        collection._id,
        selectedItems.map((i) => i._id)
      );
      handleDeleteItemFromPair(
        collection._id,
        selectedItems.map((i) => i._id)
      );

      toast.success(`${size} removed from "${collection.name}"`);
      Remove.mutate({ params: selectedItems, id: collection._id });

      resetSelectedItems();
    } else if (value) {
      EditCollection.mutate({ ...rest, count: store[collection._id].count - 1 });

      handleRemoveCollectionFromPairItem(identifier, collection._id, [value._id]);
      handleRemoveCollectionFromPairItem(collection._id, collection._id, [value._id]);
      handleDeleteItemFromPair(collection._id, [value._id]);

      toast.success(`Removed from "${collection.name}"`);
      Remove.mutate({ params: [value], id: collection._id });
    }
  }, [
    EditCollection,
    Remove,
    collection,
    handleDeleteItemFromPair,
    handleRemoveCollectionFromPairItem,
    identifier,
    resetSelectedItems,
    selectedItems,
    size,
    store,
    value,
  ]);

  return (
    <div
      onClick={() => handleRemoveFromCollection()}
      onSelect={() => handleRemoveFromCollection()}
    >
      {children}
    </div>
  );
};

export default RemoveFromCollectionWrapper;
