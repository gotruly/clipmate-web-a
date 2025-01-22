"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import { limit, orderBy } from "firebase/firestore";
import CollectionPaginateProvider from "@/providers/CollectionPaginateProvider";
import Collection from "../components/main";
import { FullPostPopupProvider } from "@/providers/FullPostPopupProvider";
import useCollectionStore from "@/stores/CollectionStore";
import { useMemo } from "react";

const CollectionPage = ({ params }: { params: { id: string } }) => {
  const { user } = FireAuthHooks.useGetUser();
  const { getStorePlaceholderValue } = useCollectionStore();

  const Placeholder = useMemo(
    () => getStorePlaceholderValue(params.id),
    [getStorePlaceholderValue, params.id]
  );

  return (
    <CollectionPaginateProvider
      url={["users", user.uid, "bookmarks"]}
      constriant={[orderBy(`collections.${params.id}.date_added`, "desc")]}
      limit={limit(30)}
      identifier={params.id}
      placeholder={Placeholder}
    >
      <FullPostPopupProvider>
        <Collection params={params} />
      </FullPostPopupProvider>
    </CollectionPaginateProvider>
  );
};

export default CollectionPage;
