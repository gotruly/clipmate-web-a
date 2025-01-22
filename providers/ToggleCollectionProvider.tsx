import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import ToggleCollectionContext from "@/context/ToggleCollection";
import { usePaginatedPageContext } from "@/lib/hooks";
import { IClipmateBase, IClipmateCollections, IClipmateResponse } from "@/types/clipmate";
import { handleSetToAnItem, handleSetToMultipleItems } from "./utils/forToggleCollection";
import { isEmpty } from "lodash";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import useSidebarAtom from "@/stores/SidebarStore";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import useCollectionStore from "@/stores/CollectionStore";
import React from "react";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import { ProgmaEscape } from "@/lib/utils";

type Props = {
  value?: IClipmateResponse;
  collection: IClipmateCollections;
  checked: boolean;
  children: React.ReactNode;
};

const ToggleCollectionProvider = React.memo(({ value, collection, checked, children }: Props) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const { user } = FireAuthHooks.useGetUser();
  const { selectedItems, setSelectedItems, resetSelectedItems } = useMultipleItemActionAtom();
  const { item, setItem } = useSidebarAtom();
  const {
    handleAddCollectionToPairItem,
    handleRemoveCollectionFromPairItem,
    handleDeleteItemFromPair,
  } = useCollectionStore();
  const { store } = useCollectionDetailsStore();
  const { identifier } = usePaginatedPageContext();

  const AddMany = FirestoreHooks.useAddManyBookmarksToCollection(
    ["users", user.uid, "bookmarks"],
    { key: "addManyItemsToCollection" }
  );

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

  const handleToggleCreate = useCallback(
    (items: IClipmateBase[], alreadyInside: boolean) => {
      if (!isEmpty(selectedItems)) {
        const Size = items.length;

        if (Size === 0) {
          toast.info(`Item(s) in ${collection.name} already`);
          return;
        }

        setIsChecked(true);
        handleSetToMultipleItems(identifier, {
          collection,
          selectedItems,
          setSelectedItems,
          handleAdd: handleAddCollectionToPairItem,
          handleRemove: handleRemoveCollectionFromPairItem,
        });

        const { _id, ...rest } = collection;
        EditCollection.mutate({ ...rest, count: store[collection._id].count + Size });
      } else if (value) {
        if (alreadyInside) {
          toast.info(`Already in "${collection.name}"`);
          return;
        }

        setIsChecked(true);
        handleSetToAnItem(identifier, {
          collection,
          item,
          value,
          setItem,
          handleAdd: handleAddCollectionToPairItem,
          handleRemove: handleRemoveCollectionFromPairItem,
        });

        const { _id, ...rest } = collection;
        EditCollection.mutate({ ...rest, count: store[collection._id].count + 1 });
      }
    },
    [
      EditCollection,
      collection,
      handleAddCollectionToPairItem,
      handleRemoveCollectionFromPairItem,
      identifier,
      item,
      selectedItems,
      setItem,
      setSelectedItems,
      store,
      value,
    ]
  );

  const handleAddToCollection = useCallback(() => {
    const NotInCollectionAlready = selectedItems.filter(
      (item) => !Object.keys(item.collections).includes(collection._id)
    );
    const Size = NotInCollectionAlready.length;

    const ItemCollections = value?.collections || {};
    const AlreadyInCollection = Object.keys(ItemCollections).some(
      (key) => key === collection._id
    );

    handleToggleCreate(NotInCollectionAlready, AlreadyInCollection);

    if (!isEmpty(NotInCollectionAlready)) {
      toast.success(`${Size} added to "${collection.name}"`);
      AddMany.mutateAsync({
        params: NotInCollectionAlready,
        id: collection._id,
        isPublic: collection.public,
      });

      if (identifier === undefined) resetSelectedItems();
    } else if (value && !AlreadyInCollection) {
      toast.success(`Added to "${collection.name}"`);
      AddMany.mutateAsync({ params: [value], id: collection._id, isPublic: collection.public });
    }
  }, [
    AddMany,
    collection,
    handleToggleCreate,
    selectedItems,
    value,
    identifier,
    resetSelectedItems,
  ]);

  const handleRemoveFromCollection = () => {
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
      if (identifier === collection._id) ProgmaEscape();
    } else if (value) {
      EditCollection.mutate({ ...rest, count: store[collection._id].count - 1 });

      handleRemoveCollectionFromPairItem(identifier, collection._id, [value._id]);
      handleRemoveCollectionFromPairItem(collection._id, collection._id, [value._id]);
      handleDeleteItemFromPair(collection._id, [value._id]);

      toast.success(`Removed from "${collection.name}"`);
      Remove.mutate({ params: [value], id: collection._id });

      if (identifier === collection._id) ProgmaEscape();
    }
  };

  return (
    <ToggleCollectionContext.Provider
      value={{
        isChecked,
        collection,
        isAdding: AddMany.isPending,
        isRemoving: Remove.isPending,
        setIsChecked,
        handleAddToCollection,
        handleRemoveFromCollection,
      }}
    >
      {children}
    </ToggleCollectionContext.Provider>
  );
});

ToggleCollectionProvider.displayName = "ToggleCollectionProvider";

export default ToggleCollectionProvider;
