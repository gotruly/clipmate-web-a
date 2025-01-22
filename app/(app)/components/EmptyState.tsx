"use client";

import { Button } from "@/components/ui/button";
import useSettingsModalAtom from "@/stores/SettingsModalStore";
import { Cloud03 } from "@untitled-ui/icons-react";

const EmptyState = () => {
  const { setOpen } = useSettingsModalAtom();

  return (
    <div className="flex flex-col items-center justify-center text-sm gap-3">
      <div className="bg-secondary rounded-full w-[40px] h-[40px] flex items-center justify-center">
        <Cloud03 width={18} />
      </div>

      <div className="text-center space-y-1">
        <p>No items added</p>
        <p className="text-muted-foreground">Add your bookmarks to get started</p>
      </div>

      <Button size="sm" onClick={() => setOpen(true)}>
        Get started
      </Button>
    </div>
  );
};

export default EmptyState;
