import { IClipmateResponse } from "@/types/clipmate";
import { cn } from "@/lib/utils";
import ClipmateResolvedServerCard from "./ClipmateResolvedServerCard";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";

type TemplateProps = { data: Array<IClipmateResponse> };

const PublicGridTemplate = ({ data }: TemplateProps) => {
  /**
   * Use a react hooks useScreen to get the current window size and
   * then display the right column grid for each break point
   */
  const [columns, setColumns] = useState<number>(5);
  const { width } = useWindowSize();

  useEffect(() => {
    if (width) {
      if (width > 2560) setColumns(7);
      if (width === 2560) setColumns(6);
      if (width > 1440 && width < 2560) setColumns(5);
      if (width > 1170 && width < 1440) setColumns(4);
      if (width > 860 && width < 1170) setColumns(3);
      if (width > 0 && width < 860) setColumns(2);
    }
  }, [width]);

  /**
   * Scroll container reference
   */
  const Ref = useRef<HTMLDivElement>(null);

  /**
   * Use the react-virtual library to virtualize the grid
   * and only render the items that are in view, creating a
   * nice masonry grid layout that is performant
   */
  const RowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => Ref.current,
    estimateSize: () => 250,
    overscan: 20,
    lanes: columns,
  });

  /**
   * We flatten the array of arrays into a single array
   */
  const AllData = data.flatMap((value) => value);

  return (
    <div ref={Ref} className={cn("h-full", { "lg:mb-[200px]": data.length < 15 })}>
      <div
        className="py-2 pl-2 pr-2.5"
        style={{
          height: `${RowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {/* We loop over the array of arrays and create n columns*/}
        {RowVirtualizer.getVirtualItems().map((value, _) => {
          const item = AllData[value.index];

          return (
            <div
              className="px-1 pt-2"
              ref={RowVirtualizer.measureElement}
              data-index={value.index}
              key={value.index}
              style={{
                position: "absolute",
                top: 0,
                left: `${value.lane * (100 / columns)}%`,
                width: `${100 / columns}%`,
                transform: `translateY(${value.start}px)`,
              }}
            >
              <ClipmateResolvedServerCard key={item._id} value={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PublicGridTemplate;
