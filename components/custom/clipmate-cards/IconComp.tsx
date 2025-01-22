import { memo } from "react";
import IconPicker from "../IconPicker";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  size: number;
  icon: string;
  hasSelectedItems: boolean;
  inPopupView?: boolean;
};

const IconCompForCard = memo(({ hasSelectedItems, inPopupView, icon, size }: Props) => {
  return (
    <>
      {hasSelectedItems && !inPopupView && (
        <Checkbox
          className="data-[state=checked]:bg-blue-700 data-[state=checked]:border-blue-700 h-[16px] w-[16px]"
          checked={true}
        />
      )}
      {!hasSelectedItems && <IconPicker size={size} type={icon} />}
    </>
  );
});

IconCompForCard.displayName = "IconCompForCard";

export default IconCompForCard;
