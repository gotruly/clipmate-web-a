import React from "react";
import ClipmateGrid from "@/components/custom/clipmate-grid/ClipmateGrid";
import { cn } from "@/lib/utils";
import { isEmpty } from "lodash";
import { usePaginatedPageContext } from "@/lib/hooks";
import EmptyState from "./EmptyState";
import SearchInput from "./SearchInput";
import TimeoutWrapper from "@/components/custom/TimeoutWrapper";
import LoadingScreen from "@/components/custom/clipmate-loading-screens/LoadingScreen";

// Memoize ClipmateGrid
const MemoizedClipmateGrid = React.memo(ClipmateGrid);

const Home: React.FC = () => {
  const {
    searchMode,
    isLoading,
    isFetching,
    displayData,
    setCursor,
    setSearchMode,
    handleSearch,
  } = usePaginatedPageContext();

  return (
    <div className={cn("w-full h-[calc(100vh-55px)] flex overflow-hidden")}>
      <div
        className={cn(
          "w-full h-full flex-1 rounded-md border-[0.5px] border-border overflow-hidden z-10 will-change-[width]"
        )}
      >
        <div className="flex flex-col items-start justify-between gap-4 border-b-[0.5px] border-border px-4 py-4 bg-card">
          <p className="font-medium text-sm">All Items</p>
          <SearchInput
            disabled={isLoading && searchMode}
            isLoading={isLoading && searchMode}
            inSearchMode={searchMode}
            onInputSubmit={(v) => handleSearch(v.search)}
            onInputReset={() => setSearchMode(false)}
          />
        </div>

        <div className={cn("h-[calc(100vh-152px)] rounded-t-none bg-card pl-4")}>
          {/* Loading - when data is pending */}
          {isLoading && <LoadingScreen />}

          {/* Data - is loaded and data is not empty */}
          {displayData.data && !isEmpty(displayData.data) && (
            <MemoizedClipmateGrid
              data={displayData}
              isSearchMode={searchMode}
              isFetching={isFetching}
              setCursor={(v) => setCursor(v)}
            />
          )}

          {/* Data - is loaded and data is empty */}
          {!isLoading && (!displayData.data || isEmpty(displayData.data)) && (
            <TimeoutWrapper>
              <EmptyState />
            </TimeoutWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
