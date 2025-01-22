import { IClipmateResponse } from "@/types/clipmate";
import ClipmateItem from "../ClipmateItem";
import React, { useEffect, useMemo, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";

type TemplateProps = { data: Array<IClipmateResponse> };

const GridTemplate = React.memo(({ data }: TemplateProps) => {
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
   * Use the react-virtual library to virtualize the grid
   * and only render the items that are in view, creating a
   * nice masonry grid layout that is performant
   */
  const RowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => document.querySelector(".clipmate-grid > div") as HTMLElement,
    estimateSize: () => 270,
    overscan: 20,
    paddingStart: 20,
    paddingEnd: 20,
    gap: 12,
    lanes: columns,
  });

  /**
   * We flatten the array of arrays into a single array
   */
  const AllData = useMemo(() => data.flatMap((value) => value), [data]);

  return (
    <div
      style={{
        height: `${RowVirtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {/* We loop over the array of arrays and create n columns*/}
      {RowVirtualizer.getVirtualItems().map((value) => {
        const item = AllData[value.index];

        return (
          <div
            className={cn({ "pr-3": (value.lane + 1) % columns !== 0 })}
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
            <ClipmateItem value={item} />
          </div>
        );
      })}
    </div>
  );
});

GridTemplate.displayName = "GridTemplate";

export default GridTemplate;
