"use client";

import FirestoreHooks from "@/app/api/hooks/firestore";
import { IClipmateFollowing } from "@/types/clipmate";
import { orderBy } from "firebase/firestore";
import PaginatedPageProvider from "@/providers/PaginatedPageProvider";
import FollowedCollection from "../components/main";
import { limit } from "firebase/firestore";
import { FullPostPopupProvider } from "@/providers/FullPostPopupProvider";
import useCollectionStore from "@/stores/CollectionStore";
import { useMemo } from "react";

const FollowedCollectionPage = ({ params }: { params: { id: string } }) => {
  const FollowingCollection = FirestoreHooks.useGetDoc<IClipmateFollowing>(
    ["collections_follow"],
    params.id,
    {
      key: "getAllCollectionsDetails",
    }
  );
  const { getStorePlaceholderValue } = useCollectionStore();

  const Placeholder = useMemo(
    () => getStorePlaceholderValue(params.id),
    [getStorePlaceholderValue, params.id]
  );

  return (
    <PaginatedPageProvider
      url={["users", FollowingCollection.data?.origin_user_id || "", "bookmarks"]}
      constriant={[
        orderBy(`collections.${FollowingCollection.data?.collection_id}.date_added`, "desc"),
      ]}
      limit={limit(30)}
      identifier={params.id}
      placeholder={Placeholder}
    >
      <FullPostPopupProvider>
        <FollowedCollection params={params} />
      </FullPostPopupProvider>
    </PaginatedPageProvider>
  );
};

export default FollowedCollectionPage;
