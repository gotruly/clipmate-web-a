"use client";

import React, { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import ClipmateLinkLoadingCard from "../clipmate-loading-cards/ClipmateLinkLoadingCard";
import ClipmatePDFLoadingCard from "../clipmate-loading-cards/ClipmatePDFLoadingCard";
import ClipmateTwitterLoadingCard from "../clipmate-loading-cards/ClipmateTwitterLoadingCard";
import ClipmateRedditLoadingCard from "../clipmate-loading-cards/ClipmateRedditLoadingCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import ClipmateGithubLoadingCard from "../clipmate-loading-cards/ClipmateGithubLoadingCard";
import { useVirtualizer } from "@tanstack/react-virtual";
import { cn } from "@/lib/utils";

type Props = {
  count?: number;
};

const LoadingScreen = ({ count = 50 }: Props) => {
  const [columns, setColumns] = useState<number>(5);

  /**
   * Use a react hooks useScreen to get the current window size and
   * then display the right column grid for each break point
   */
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
   * This is the main logic for the grid
   */
  const data = Array.from({ length: count }, (_, i) => {
    if (i % 2 === 0) return "twitter";
    if (i % 3 === 0) return "reddit";
    if (i % 4 === 0) return "link";
    if (i % 5 === 0) return "PDF";
    if (i % 6 === 0) return "github";
    return "twitter";
  });

  /**
   * Resolved Loading Card
   */
  const Resolved = ({ source }: { source: string }) => {
    if (source === "twitter") return <ClipmateTwitterLoadingCard />;
    if (source === "reddit") return <ClipmateRedditLoadingCard />;
    if (source === "link") return <ClipmateLinkLoadingCard />;
    if (source === "PDF") return <ClipmatePDFLoadingCard />;
    if (source === "github") return <ClipmateGithubLoadingCard />;
  };

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
    paddingEnd: 20,
    paddingStart: 20,
    gap: 12,
    lanes: columns,
  });

  return (
    <ScrollArea className="h-full flex clipmate-grid pr-2">
      <div
        style={{
          height: `${RowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {/* We loop over the array of arrays and create n columns*/}
        {RowVirtualizer.getVirtualItems().map((value) => {
          const item = data[value.index];

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
              <Resolved source={item} />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default LoadingScreen;
