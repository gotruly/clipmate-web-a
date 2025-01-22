import { IClipmateFollowing } from "@/types/clipmate";
import { atom, useAtom } from "jotai";
import { useCallback, useMemo } from "react";

type FollowedCollectionsDetailsType = Record<string, IClipmateFollowing>;

const FollowedCollectionDetailsStore = atom<FollowedCollectionsDetailsType>(
  {} as FollowedCollectionsDetailsType
);

const useFollowedCollectionDetailsStore = () => {
  const [store, setStore] = useAtom(FollowedCollectionDetailsStore);

  const handleAddCollectionsDetails = useCallback(
    (collection?: IClipmateFollowing[]) => {
      collection?.forEach((collection) => {
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

export default useFollowedCollectionDetailsStore;
