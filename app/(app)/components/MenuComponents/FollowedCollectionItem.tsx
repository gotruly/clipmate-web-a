"use client";

import { cn } from "@/lib/utils";
import { IClipmateCollections, IClipmateFollowing } from "@/types/clipmate";
import { usePathname } from "next/navigation";
import Link from "next/link";
import FirestoreHooks from "@/app/api/hooks/firestore";
import ShareFolderIcon from "@/components/icons/shared-folder";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  collection: IClipmateFollowing;
};

const FollowedCollectionItem = ({ collection }: Props) => {
  const path = usePathname();
  const paths = path.split("/").filter((value) => value !== "");

  const CollectionDetails = FirestoreHooks.useGetDoc<IClipmateCollections>(
    ["collections"],
    collection.collection_id,
    {
      key: "getFollowedCollectionsDetails",
    }
  );

  return (
    <Link
      href={`/following/${collection._id}`}
      className={cn(
        "py-1 px-2 flex items-center rounded-md dark:hover:bg-secondary/50 hover:bg-card/95 hover:drop-shadow-sm gap-1.5",
        {
          "dark:bg-secondary bg-card drop-shadow-sm": paths[1] === collection._id,
        }
      )}
    >
      <ShareFolderIcon width={17} />

      <p className="text-[13px] font-medium text-ellipsis overflow-hidden whitespace-nowrap w-full">
        {CollectionDetails.isLoading && <Skeleton className="h-4 w-full" />}
        {CollectionDetails.data && CollectionDetails.data.name}
      </p>
    </Link>
  );
};

export default FollowedCollectionItem;
