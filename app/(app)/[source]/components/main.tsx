"use client";

import React from "react";
import ClipmateGrid from "@/components/custom/clipmate-grid/ClipmateGrid";
import { cn } from "@/lib/utils";
import { isEmpty } from "lodash";
import { usePaginatedPageContext, useValidSlug } from "@/lib/hooks";
import SourcesEmptyState from "../../components/SourcesComponents/EmptyStates";
import SearchInput from "../../components/SearchInput";
import TimeoutWrapper from "@/components/custom/TimeoutWrapper";
import LoadingScreen from "@/components/custom/clipmate-loading-screens/LoadingScreen";

const Source = ({ params }: { params: { source: string } }) => {
  // Make sure the user is hitting a slug that exist before
  // they are allowed to do anything;
  useValidSlug(params.source);

  const {
    isLoading,
    isFetching,
    searchMode,
    displayData,
    setCursor,
    setSearchMode,
    handleSearch,
  } = usePaginatedPageContext();

  return (
    <div className={cn("w-full h-[calc(100vh-20px)] flex overflow-hidden")}>
      <div
        className={cn(
          "w-full h-full flex-1 rounded-md border-[0.5px] border-border overflow-hidden z-10 will-change-[width]"
        )}
      >
        <div className="flex flex-col items-start justify-between gap-2 border-b-[0.5px] border-border px-2 py-2 bg-card h-[80px]">
          <p className="font-medium text-sm capitalize">{params.source}</p>
          <SearchInput
            disabled={isLoading && searchMode}
            isLoading={isLoading && searchMode}
            inSearchMode={searchMode}
            onInputSubmit={(v) => handleSearch(v.search)}
            onInputReset={() => setSearchMode(false)}
          />
        </div>

        <div className={cn("h-[calc(100vh-96px)] rounded-t-none bg-card pl-4")}>
          {/* Loading - when data is pending */}
          {isLoading && <LoadingScreen />}

          {/* Data - is loaded and data is not empty */}
          {displayData.data && !isEmpty(displayData.data) && (
            <ClipmateGrid
              data={displayData}
              isSearchMode={searchMode}
              isFetching={isFetching}
              setCursor={(v) => setCursor(v)}
            />
          )}

          {/* Data - is loaded and data is empty */}
          {!isLoading && (!displayData.data || isEmpty(displayData.data)) && (
            <TimeoutWrapper>
              <SourcesEmptyState type={params.source} />
            </TimeoutWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default Source;
