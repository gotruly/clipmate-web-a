import { IClipmateCollections } from "@/types/clipmate";
import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";

type CollectionsDetailsType = Record<string, IClipmateCollections>;

const CollectionDetailsStore = atom<CollectionsDetailsType>({} as CollectionsDetailsType);

const useCollectionDetailsStore = () => {
  const [store, setStore] = useAtom(CollectionDetailsStore);

  const handleAddCollectionsDetails = useCallback(
    (collection?: IClipmateCollections[]) => {
      if (!collection) return;

      collection.forEach((collection) => {
        setStore((prev) => ({
          ...prev,
          [collection._id]: collection,
        }));
      });
    },
    [setStore]
  );

  const MemoizedStore = useMemo(() => store, [store]);

  return {
    store: MemoizedStore,
    setStore,
    handleAddCollectionsDetails,
  };
};

export default useCollectionDetailsStore;
