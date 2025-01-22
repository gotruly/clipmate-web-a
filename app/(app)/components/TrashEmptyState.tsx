"use client";

import { Button } from "@/components/ui/button";
import { Trash04 } from "@untitled-ui/icons-react";
import Link from "next/link";

const TrashEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center text-sm gap-3">
      <div className="bg-secondary rounded-full w-[40px] h-[40px] flex items-center justify-center">
        <Trash04 width={18} />
      </div>

      <div className="text-center space-y-1">
        <p>No items in trash</p>
        <p className="text-zinc-500">If you move any item to trash, you&apos;ll see them here</p>
      </div>

      <Button size="sm" asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  );
};

export default TrashEmptyState;
