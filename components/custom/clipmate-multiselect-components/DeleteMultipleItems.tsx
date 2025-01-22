import { Button } from "@/components/ui/button";
import { Trash04 } from "@untitled-ui/icons-react";
import MoveToTrashWrapper from "@/providers/MoveToTrashProvider";

type Props = {
  disabled?: boolean;
};

const DeleteMultipleItems = ({ disabled }: Props) => {
  return (
    <MoveToTrashWrapper>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-[13px]"
        disabled={disabled}
      >
        <Trash04 width={16} />
        <span>Move to Trash</span>
      </Button>
    </MoveToTrashWrapper>
  );
};

export default DeleteMultipleItems;
