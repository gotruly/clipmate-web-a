import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { usePaginatedPageContext } from "@/lib/hooks";
import { IClipmateBase, IClipmateCollections } from "@/types/clipmate";
import { handleSetToMultipleItems } from "./utils/forToggleCollection";
import { isEmpty } from "lodash";
import { useCallback } from "react";
import { toast } from "sonner";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import useCollectionStore from "@/stores/CollectionStore";
import React from "react";
import OnDropToCollectionContext from "@/context/OnDropToCollectionContext";

type Props = {
  collection: IClipmateCollections;
  children: React.ReactNode;
};

const onDropToCollectionProvider = React.memo(({ collection, children }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { draggedItems, setDraggedItems, resetDraggedItems, resetSelectedItems } =
    useMultipleItemActionAtom();
  const { store, handleAddCollectionToPairItem, handleRemoveCollectionFromPairItem } =
    useCollectionStore();
  const { identifier } = usePaginatedPageContext();

  const AddMany = FirestoreHooks.useAddManyBookmarksToCollection(
    ["users", user.uid, "bookmarks"],
    { key: "addManyItemsToCollection" }
  );

  const EditCollection = FirestoreHooks.useEditDoc<IClipmateCollections>(
    ["collections"],
    collection._id,
    { key: `edit_${collection._id}` }
  );

  const handleToggleCreate = useCallback(
    (items: IClipmateBase[]) => {
      if (!isEmpty(draggedItems)) {
        const Size = items.length;

        if (Size === 0) {
          toast.info(`Item(s) in ${collection.name} already`);
          return;
        }

        handleSetToMultipleItems(identifier, {
          collection,
          selectedItems: draggedItems,
          setSelectedItems: setDraggedItems,
          handleAdd: handleAddCollectionToPairItem,
          handleRemove: handleRemoveCollectionFromPairItem,
        });

        const { _id, ...rest } = collection;
        EditCollection.mutate({ ...rest, count: store[collection._id]?.count + Size });
      }
    },
    [
      EditCollection,
      collection,
      draggedItems,
      handleAddCollectionToPairItem,
      handleRemoveCollectionFromPairItem,
      identifier,
      setDraggedItems,
      store,
    ]
  );

  const handleAddToCollection = useCallback(() => {
    const NotInCollectionAlready = draggedItems.filter(
      (item) => !Object.keys(item.collections).includes(collection._id)
    );
    const Size = NotInCollectionAlready.length;

    handleToggleCreate(NotInCollectionAlready);

    if (!isEmpty(NotInCollectionAlready)) {
      toast.success(`${Size} added to "${collection.name}"`);
      AddMany.mutateAsync({
        params: NotInCollectionAlready,
        id: collection._id,
        isPublic: collection.public,
      });
    }

    resetDraggedItems();
    resetSelectedItems();
  }, [
    AddMany,
    collection,
    draggedItems,
    handleToggleCreate,
    resetDraggedItems,
    resetSelectedItems,
  ]);

  return (
    <OnDropToCollectionContext.Provider
      value={{
        collection,
        handleAddToCollection,
      }}
    >
      {children}
    </OnDropToCollectionContext.Provider>
  );
});

onDropToCollectionProvider.displayName = "OnDropToCollectionProvider";

export default onDropToCollectionProvider;
