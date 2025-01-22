import { Checkbox } from "@/components/ui/checkbox";
import { CommandItem } from "@/components/ui/command";
import { useToggleCollectionContext } from "@/lib/hooks";
import { cn } from "@/lib/utils";

type Props = {
  onSelect?: () => void;
  hide?: boolean;
  cid: string;
};
const DropdownAddToCollectionItem = ({ onSelect, cid, hide }: Props) => {
  const {
    isChecked,
    collection,
    setIsChecked,
    handleAddToCollection,
    handleRemoveFromCollection,
  } = useToggleCollectionContext();

  const handleCheckboxChange = (change: boolean) => {
    setIsChecked(change);
    if (isChecked) handleRemoveFromCollection();
    else handleAddToCollection();
  };

  const handleAddition = () => {
    handleAddToCollection();
    onSelect && onSelect();
  };

  return (
    <div
      className={cn("w-full flex items-center rounded-md cursor-pointer relative", {
        hidden: hide,
      })}
    >
      <Checkbox
        className="absolute left-2 z-10"
        checked={isChecked}
        onCheckedChange={(c) => handleCheckboxChange(c as boolean)}
      />
      <CommandItem
        value={cid}
        onSelect={() => handleAddition()}
        className="w-full cursor-pointer pl-8 group-hover:bg-accent group-hover:dark:bg-[#292929] data-[selected='true']:dark:bg-[#292929] focus:dark:!bg-[#292929] text-[13px]"
      >
        <span className="text-ellipsis overflow-hidden whitespace-nowrap">{collection.name}</span>
      </CommandItem>
    </div>
  );
};

export default DropdownAddToCollectionItem;
