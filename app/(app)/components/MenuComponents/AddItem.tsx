import { Button } from "@/components/ui/button";
import { useDragNDropContext } from "@/lib/hooks";
import { Plus } from "@untitled-ui/icons-react";
import React from "react";

const AddItem = React.memo(() => {
  const { setOpenDialog } = useDragNDropContext();

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 px-1.5 py-1.5 h-7 w-7 border border-border rounded-[10px]"
      onClick={() => setOpenDialog(true)}
    >
      <Plus width={16} height={16} />
    </Button>
  );
});

AddItem.displayName = "AddItem";

export default AddItem;
