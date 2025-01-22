import useSidebarAtom from "@/stores/SidebarStore";
import { Button } from "@/components/ui/button";
import { Maximize01, Minimize01, X } from "@untitled-ui/icons-react";

const FullPostActions = () => {
  const { open, handleOpen, handleClose, handleOpenDialog, setReaderMode } = useSidebarAtom();

  const handleToggle = () => {
    if (open) handleClose();
    else handleOpen();
  };

  const handleCloseDialog = () => {
    handleOpenDialog(false, { url: null, item: null });
    handleClose();
    setReaderMode(false);
  };

  return (
    <div className="w-fit grid gap-1.5">
      <Button
        className="rounded-full !ring-0 !ring-transparent !outline-none h-[30px] w-[30px]"
        size="icon"
        variant="outline"
        onClick={() => handleCloseDialog()}
        tabIndex={500}
        autoFocus={false}
      >
        <X width={14} />
      </Button>
      <Button
        className="rounded-full !ring-0 !ring-transparent !outline-none h-[30px] w-[30px]"
        size="icon"
        variant="outline"
        onClick={() => handleToggle()}
        tabIndex={500}
        autoFocus={false}
      >
        {open ? <Minimize01 width={14} /> : <Maximize01 width={14} />}
      </Button>
    </div>
  );
};

export default FullPostActions;
