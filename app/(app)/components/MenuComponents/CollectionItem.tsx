"use client";

import { cn } from "@/lib/utils";
import { Folder } from "@untitled-ui/icons-react";
import { IClipmateCollections } from "@/types/clipmate";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import ShareFolderIcon from "@/components/icons/shared-folder";
import { orderBy } from "firebase/firestore";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import useCollectionStore from "@/stores/CollectionStore";
import { useOnDropToCollectionContext } from "@/lib/hooks";

type Props = {
  collection: IClipmateCollections;
};

const CollectionItem = React.memo(({ collection }: Props) => {
  const router = useRouter();

  const MemoColl = useMemo(() => collection, [collection]);

  const Collection = useCollectionStore();
  const { store, handleAddCollectionsDetails } = useCollectionDetailsStore();
  const { handleAddToCollection } = useOnDropToCollectionContext();

  const path = usePathname();
  const paths = path.split("/").filter((value) => value !== "");

  const [hovered, setHovered] = useState<boolean>(false);

  const { user } = FireAuthHooks.useGetUser();
  const Count = FirestoreHooks.useGetDocsCount(["users", user.uid, "bookmarks"], {
    key: `getCount_${MemoColl._id}`,
    placeholder: Collection.store[MemoColl._id]?.count,
    constraints: [orderBy(`collections.${MemoColl._id}.date_added`, "desc")],
  });

  const EditCollection = FirestoreHooks.useEditDoc<IClipmateCollections>(
    ["collections"],
    MemoColl._id,
    { key: `edit_${MemoColl._id}` }
  );

  // If collection count is not available, fetch it and add it to collection
  useEffect(() => {
    if (MemoColl.count === undefined) {
      Count.mutate(undefined, {
        onSuccess: (res) => {
          const { _id, ...rest } = MemoColl;
          handleAddCollectionsDetails([{ ...rest, _id: MemoColl._id, count: res }]);
          EditCollection.mutate({ ...rest, count: res });
        },
      });
    }
  }, [MemoColl]);

  const handleOver = () => {
    setHovered(true);
  };

  const handleExit = () => {
    setHovered(false);
  };

  const handleDrop = useCallback(() => {
    setHovered(false);
    handleAddToCollection();
  }, [handleAddToCollection]);

  useEffect(() => {
    router.prefetch(`/collections/${MemoColl._id}`);
  }, [MemoColl._id, router, path]);

  return (
    <div
      onDragOver={() => handleOver()}
      onDrop={() => handleDrop()}
      onDragLeave={() => handleExit()}
    >
      <Link
        href="/collections/[slug]"
        as={`/collections/${MemoColl._id}`}
        prefetch={true}
        shallow={true}
        className={cn(
          "h-[26px] grid grid-cols-[15px_auto_auto] truncate items-center rounded-md dark:hover:bg-secondary/50 hover:bg-muted/50 gap-2.5 px-2",
          {
            "dark:bg-secondary bg-muted drop-shadow-sm": paths[1] === MemoColl._id,
            "bg-transparent shadow-[inset_0_0_0_2px_hsl(var(--border))]": hovered,
          }
        )}
      >
        <div className="text-[#525252] dark:text-[#A3A3A3]">
          {MemoColl.public ? <ShareFolderIcon width={17} /> : <Folder width={15} />}
        </div>

        <p className="text-[13px] text-[#424242] dark:text-[#D6D6D6] font-medium text-ellipsis overflow-hidden whitespace-nowrap w-full">
          {MemoColl.name}
        </p>

        <p className="text-[11px] text-[#424242] dark:text-[#D6D6D6] font-medium justify-self-end text-center bg-card rounded-md px-1">
          {store[MemoColl._id]?.count || 0}
        </p>
      </Link>
    </div>
  );
});

CollectionItem.displayName = "CollectionItem";

export default CollectionItem;
