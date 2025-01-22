import { Button } from "@/components/ui/button";
import { RefreshCcw01 } from "@untitled-ui/icons-react";
import RestoreFromTrashWrapper from "@/providers/RestoreFromTrashProvider";

type Props = {
  disabled?: boolean;
};

const RestoreMultipleItems = ({ disabled }: Props) => {
  return (
    <RestoreFromTrashWrapper>
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 text-[13px]"
        disabled={disabled}
      >
        <RefreshCcw01 width={16} />
        <span>Restore</span>
      </Button>
    </RestoreFromTrashWrapper>
  );
};

export default RestoreMultipleItems;
