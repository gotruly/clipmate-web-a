import ClipmateMultiSelect from "@/components/custom/ClipmateMultiSelect";
import { cn } from "@/lib/utils";
import useMultipleItemActionAtom from "@/stores/MultiItemActionStore";
import { isEmpty } from "lodash";
import { useRef } from "react";

const MultipleItemActionProvider = ({ children }: { children: React.ReactNode }) => {
  const IndicatorRef = useRef<HTMLDivElement>(null);
  const { isDragging, selectedItems } = useMultipleItemActionAtom();

  return (
    <>
      <div
        ref={IndicatorRef}
        id="multiple-indicator"
        className={cn(
          "hidden absolute top-0 right-0 bg-red-500 text-white text-sm font-medium w-6 h-6 rounded-full z-50 items-center justify-center pointer-events-none",
          {
            flex: isDragging && selectedItems.length > 1,
          }
        )}
      >
        {selectedItems.length}
      </div>

      {!isEmpty(selectedItems) && <ClipmateMultiSelect />}

      {children}
    </>
  );
};

export default MultipleItemActionProvider;
