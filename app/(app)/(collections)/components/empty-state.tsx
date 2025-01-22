"use client";

import ShareFolderIcon from "@/components/icons/shared-folder";
import { Button } from "@/components/ui/button";
import { Folder, Lock04 } from "@untitled-ui/icons-react";
import { useRouter } from "next/navigation";

const SharedCollectionsEmptyState = () => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-4">
      <div className="flex flex-col items-center justify-center text-sm gap-3">
        <div className="bg-secondary rounded-full w-[40px] h-[40px] flex items-center justify-center">
          <ShareFolderIcon width={18} height={18} />
        </div>

        <div className="text-center space-y-1">
          <p>No items added</p>
          <p className="text-muted-foreground">There are no items in this collection yet.</p>
        </div>
      </div>
    </div>
  );
};

const SharedCollectionsPrivateState = () => {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-4">
      <div className="flex flex-col items-center justify-center text-sm gap-3">
        <div className="bg-secondary rounded-full w-[40px] h-[40px] flex items-center justify-center">
          <Lock04 width={18} height={18} />
        </div>

        <div className="text-center space-y-1">
          <p>This collection is now private</p>
          <p className="text-muted-foreground">
            This collection has been made private by the owner.
          </p>
        </div>
      </div>
    </div>
  );
};

const CollectionsEmptyState = () => {
  const router = useRouter();

  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-4">
      <div className="flex flex-col items-center justify-center text-sm gap-3">
        <div className="bg-secondary rounded-full w-[40px] h-[40px] flex items-center justify-center">
          <Folder width={18} />
        </div>

        <div className="text-center space-y-1">
          <p>No items added</p>
          <p className="text-muted-foreground">
            Start adding bookmarks from your feed to see them here
          </p>
        </div>

        <Button size="sm" onClick={() => router.push("/")}>
          Add items
        </Button>
      </div>
    </div>
  );
};

export { SharedCollectionsEmptyState, SharedCollectionsPrivateState };
export default CollectionsEmptyState;
