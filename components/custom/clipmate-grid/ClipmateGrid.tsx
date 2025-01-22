"use client";

import { IClipmateResponse } from "@/types/clipmate";
import React, { useEffect, useState } from "react";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import GridTemplate from "./ClipmateGridTemplate";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PaginatedResult } from "@/app/api/firestore";

type Props = {
  data: PaginatedResult<IClipmateResponse>;
  setCursor?: (v: QueryDocumentSnapshot<DocumentData> | null) => void;
  isSearchMode?: boolean;
  isFetching?: boolean;
};

const EndMessage = ({ data }: { data: PaginatedResult<IClipmateResponse> }) => (
  <>
    {data.data.length > 0 && data.count > 30 && data.data.length === data.count && (
      <div className="w-full flex items-center justify-center text-sm text-gray-400 py-4">
        <p>&#x1F389; You&apos;ve reached the end of your bookmarks!</p>
      </div>
    )}
  </>
);

const ClipmateGrid = React.memo(({ data, setCursor, isSearchMode, isFetching }: Props) => {
  useEffect(() => {
    const Scroll = document.querySelector(".clipmate-grid > div") as HTMLElement;

    const handleScroll = () => {
      if (!isFetching && data.data.length < data.count) {
        const scrollTop = Scroll.scrollTop;
        const scrollHeight = Scroll.scrollHeight;
        const clientHeight = Scroll.clientHeight;
        const scrolledPercentage = (scrollTop + clientHeight) / scrollHeight;

        if (scrolledPercentage >= 0.8) {
          setCursor && setCursor(data.lastVisible);
        }
      }
    };

    Scroll.addEventListener("scroll", handleScroll);

    return () => {
      Scroll.removeEventListener("scroll", handleScroll);
    };
  }, [data.count, data.data.length, data.lastVisible, isFetching, setCursor]);

  return (
    <ScrollArea className="h-full flex clipmate-grid pr-2">
      <GridTemplate data={data.data} />
      <EndMessage data={data} />
    </ScrollArea>
  );
});

ClipmateGrid.displayName = "ClipmateGrid";

export default ClipmateGrid;
