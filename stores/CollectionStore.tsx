import { IClipmateCollections, IClipmateFollowing, IClipmateResponse } from "@/types/clipmate";
import { Timestamp } from "firebase/firestore";
import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";
import useCollectionDetailsStore from "./CollectionDetailsStore";

type StoreItem = {
  data: IClipmateResponse[] | undefined;
  count: number;
};

type CollectionStoreType = Record<string, StoreItem>;

const CollectionStore = atom<CollectionStoreType>({} as CollectionStoreType);

const useCollectionStore = () => {
  const [store, setStore] = useAtom(CollectionStore);
  const CollectionDetails = useCollectionDetailsStore();

  const handleAddNewPair = (identifier: string, items: IClipmateResponse[], count: number) => {
    setStore((prev) => ({
      ...prev,
      ...{
        [identifier]: {
          data: items,
          count: count,
        },
      },
    }));
  };

  const handleDeleteItemFromPair = (identifier: string, ids: string[], mutate?: () => void) => {
    mutate && mutate();

    setStore((prev) => ({
      ...prev,
      ...{
        [identifier]: {
          count: prev[identifier]?.count - ids.length,
          data: prev[identifier]?.data?.filter((item) => !ids.includes(item._id)),
        },
      },
    }));

    CollectionDetails.setStore((prev) => ({
      ...prev,
      ...{ [identifier]: { ...prev[identifier], count: prev[identifier].count - ids.length } },
    }));
  };

  const handleAddItemToPair = (
    identifier: string,
    items: IClipmateResponse[],
    count?: number
  ) => {
    setStore((prev) => ({
      ...prev,
      ...{
        [identifier]: {
          count: count || prev[identifier].count + items.length,
          data: [
            // We are only adding an item to the store item (pair) if it doesn't already exist
            ...(prev[identifier]?.data || []),
            ...items.filter(
              (item) =>
                !prev[identifier]?.data?.some((existingItem) => existingItem._id === item._id)
            ),
          ],
        },
      },
    }));
  };

  const handleRealtimeAddItemToPair = (
    identifier: string,
    items: IClipmateResponse[],
    count?: number
  ) => {
    setStore((prev) => ({
      ...prev,
      ...{
        [identifier]: {
          count: count || prev[identifier]?.count + items.length,
          data: [
            // We are only adding an item to the store item (pair) if it doesn't already exist
            ...items.filter(
              (item) =>
                !prev[identifier]?.data?.some((existingItem) => existingItem._id === item._id)
            ),
            ...(prev[identifier]?.data || []),
          ],
        },
      },
    }));
  };

  const handleAddItemToCollection = useCallback(
    (identifier: string, items: IClipmateResponse[], count?: number) => {
      setStore((prev) => ({
        ...prev,
        ...{
          [identifier]: {
            count: (count || prev[identifier]?.count) + items.length,
            data: [
              // We are only adding an item to the store item (pair) if it doesn't already exist
              ...items
                .filter(
                  (item) =>
                    !prev[identifier]?.data?.some((existingItem) => existingItem._id === item._id)
                )
                .reverse()
                .map(
                  (item) =>
                    ({
                      ...item,
                      collections: {
                        ...item.collections,
                        ...{ [identifier]: { date_added: Timestamp.fromDate(new Date()) } },
                      },
                    } as IClipmateResponse)
                ),
              ...(prev[identifier]?.data || []),
            ],
          },
        },
      }));
    },
    [setStore]
  );

  const handleAddCollectionToPairItem = useCallback(
    (identifier: string, collection: string, items: IClipmateResponse[]) => {
      const ids = items.map((item) => item._id);
      handleAddItemToCollection(collection, items);

      setStore((prev) => ({
        ...prev,
        ...{
          [identifier]: {
            ...prev[identifier],
            data: prev[identifier]?.data?.map((value) =>
              ids.includes(value._id)
                ? {
                    ...value,
                    collections: {
                      ...value.collections,
                      ...{ [collection]: { date_added: Timestamp.fromDate(new Date()) } },
                    },
                  }
                : value
            ),
          },
        },
      }));

      CollectionDetails.setStore((prev) => ({
        ...prev,
        ...{
          [collection]: {
            ...prev[collection],
            count: prev[collection].count + ids.length,
          },
        },
      }));
    },
    [handleAddItemToCollection, setStore, CollectionDetails]
  );

  const handleRemoveCollectionFromPairItem = (
    identifier: string,
    collection: string,
    ids: string[],
    mutate?: () => void
  ) => {
    setStore((prev) => ({
      ...prev,
      ...{
        [identifier]: {
          ...prev[identifier],
          data: prev[identifier]?.data?.map((value) =>
            ids.includes(value._id)
              ? {
                  ...value,
                  collections: Object.keys(value.collections)
                    .filter((key) => key !== collection)
                    .reduce((acc, key) => {
                      acc[key] = value.collections[key];
                      return acc;
                    }, {} as Record<string, { date_added: Timestamp }>),
                }
              : value
          ),
        },
      },
    }));

    mutate && mutate();
  };

  const handleAddCollectionsDetails = (collection?: IClipmateCollections[]) => {
    collection?.forEach((collection) => {
      CollectionDetails.setStore((prev) => ({
        ...prev,
        [collection._id]: collection,
      }));
    });
  };

  const MemoizedStore = useMemo(() => store, [store]);

  const getStorePlaceholderValue = useCallback(
    (identifier: string) => {
      return {
        data: MemoizedStore[identifier]?.data?.slice(0, 35) || undefined,
        lastVisible: null,
        count: MemoizedStore[identifier]?.count || 0,
      };
    },
    [MemoizedStore]
  );

  return {
    store: MemoizedStore,
    setStore,
    handleAddNewPair,
    handleAddItemToPair,
    handleRealtimeAddItemToPair,
    handleAddItemToCollection,
    handleDeleteItemFromPair,
    handleAddCollectionToPairItem,
    handleRemoveCollectionFromPairItem,
    handleAddCollectionsDetails,
    getStorePlaceholderValue,
  };
};

export default useCollectionStore;
