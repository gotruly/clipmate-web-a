import { Checkbox } from "@/components/ui/checkbox";
import { CommandItem } from "@/components/ui/command";
import { usePaginatedPageContext, useToggleCollectionContext } from "@/lib/hooks";
import { cn, ProgmaEscape } from "@/lib/utils";

type Props = {
  hide?: boolean;
};

const AddToCollectionItem = ({ hide }: Props) => {
  const { identifier } = usePaginatedPageContext();
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

  const inUnsorted = identifier === "getAllClipmateUnsortedItems";

  return (
    <div
      className={cn("w-full flex items-center rounded-md cursor-pointer relative group", {
        hidden: hide,
      })}
    >
      <Checkbox
        className="absolute left-2 z-10"
        checked={isChecked}
        onCheckedChange={(c) => handleCheckboxChange(c as boolean)}
      />
      <CommandItem
        onSelect={() => {
          handleAddToCollection();
          if (inUnsorted) ProgmaEscape();
        }}
        className="w-full cursor-pointer pl-8 group-hover:bg-accent group-hover:dark:bg-[#292929] data-[selected='true']:dark:bg-[#292929] focus:dark:!bg-[#292929] !text-[13px]"
      >
        <span className="text-ellipsis overflow-hidden whitespace-nowrap">{collection.name}</span>
      </CommandItem>
    </div>
  );
};

export default AddToCollectionItem;
