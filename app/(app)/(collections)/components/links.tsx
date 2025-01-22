import { IClipmateCollections } from "@/types/clipmate";
import { Folder } from "lucide-react";
import Link from "next/link";
import { AddItemToCollectionType } from "@/schema/collection";
import FirestoreHooks from "@/app/api/hooks/firestore";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  collection: IClipmateCollections;
};

const CollectionLink = ({ collection }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { data, isLoading } = FirestoreHooks.useGetManyDocs<AddItemToCollectionType>(
    ["users", user.uid, "collections", collection._id, "items"],
    { key: "getAllItemsInACollection" }
  );

  return (
    <Link
      key={collection._id}
      href={`/collections/${collection._id}`}
      className="py-1.5 px-3 flex items-center rounded-lg hover:bg-accent gap-2"
    >
      <div className="bg-muted p-3 rounded-lg">
        <Folder size={22} />
      </div>

      <div className="flex flex-col gap-0">
        <p className="text-sm font-medium m-0">{collection.name}</p>

        {isLoading && <Skeleton className="w-8 h-2" />}
        {!isLoading && data && (
          <p className="text-xs text-muted-foreground m-0">{data.length} items</p>
        )}
      </div>
    </Link>
  );
};

export default CollectionLink;
