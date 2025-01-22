"use client";

import FirestoreHooks from "@/app/api/hooks/firestore";
import ClipmateGrid from "@/components/custom/clipmate-grid/ClipmateGrid";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IClipmateCollections, IClipmateFollowing } from "@/types/clipmate";
import { usePaginatedPageContext } from "@/lib/hooks";
import {
  SharedCollectionsEmptyState,
  SharedCollectionsPrivateState,
} from "../../components/empty-state";
import { isEmpty } from "lodash";
import { notFound } from "next/navigation";
import { Folder, Globe01 } from "@untitled-ui/icons-react";
import FollowButton from "../../components/follow-button";
import useCollectionStore from "@/stores/CollectionStore";
import LoadingScreen from "@/components/custom/clipmate-loading-screens/LoadingScreen";

const FollowedCollection = ({ params }: { params: { id: string } }) => {
  const { store } = useCollectionStore();

  const FollowingCollection = FirestoreHooks.useGetDoc<IClipmateFollowing>(
    ["collections_follow"],
    params.id,
    {
      key: "getAllCollectionsDetails",
      gcTime: Infinity,
    }
  );

  const CollectionDetails = FirestoreHooks.useGetDoc<IClipmateCollections>(
    ["collections"],
    FollowingCollection.data?.collection_id || "",
    {
      key: "getAllCollectionsDetails",
      placeholder: store[params.id],
      gcTime: Infinity,
    }
  );

  if (!CollectionDetails.isLoading && !CollectionDetails.data?.name) {
    notFound();
  }

  const { isLoading, isFetching, displayData, queryData, setCursor } = usePaginatedPageContext();

  return (
    <div className={cn("w-full h-[calc(100vh-20px)] flex overflow-hidden")}>
      <div
        className={cn(
          "w-full h-full flex-1 rounded-md border-[0.5px] border-border overflow-hidden z-10 will-change-[width]"
        )}
      >
        <div className="flex flex-col items-start justify-between gap-10 border-b-[0.5px] border-border px-3 pt-3 bg-card h-[150px]">
          {CollectionDetails.isLoading && <Skeleton className="h-3 w-24" />}
          {!CollectionDetails.isLoading && CollectionDetails.data && (
            <Breadcrumb>
              <BreadcrumbList className="sm:gap-1">
                <BreadcrumbPage className="text-muted-foreground">All items</BreadcrumbPage>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="text-sm flex items-center gap-1">
                  <Globe01 width={16} />
                  {CollectionDetails.data.name}
                </BreadcrumbPage>
              </BreadcrumbList>
            </Breadcrumb>
          )}

          <div className="grid gap-2 w-full">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center h-8 w-8 bg-secondary border border-input rounded-md">
                  <Folder width={16} />
                </div>
                <h1 className="text-2xl font-semibold">
                  {CollectionDetails.isLoading && <Skeleton className="h-6 w-60" />}
                  {CollectionDetails.data && CollectionDetails.data.name}
                </h1>
              </div>

              <div className="flex items-center gap-1">
                {FollowingCollection.data && CollectionDetails.data && (
                  <FollowButton id={params.id} />
                )}
              </div>
            </div>

            <div className="w-full">
              {CollectionDetails.isLoading && <Skeleton className="h-10 w-96 mb-2" />}

              {CollectionDetails.data && CollectionDetails.data.description && (
                <p className="w-full h-10 max-w-[72ch] mb-2 text-sm text-wrap text-muted-foreground">
                  {CollectionDetails.data.description}
                </p>
              )}

              {CollectionDetails.data && !CollectionDetails.data.description && (
                <p className="w-full h-10 text-sm text-muted-foreground">No description</p>
              )}
            </div>
          </div>
        </div>

        <div className={cn("h-[calc(100vh-170px)] rounded-t-none bg-card pl-4")}>
          {/* Loading - when data is pending */}
          {isLoading && <LoadingScreen />}

          {/* Data - is loaded and data is not empty */}
          {!isLoading &&
            (!queryData || isEmpty(queryData)) &&
            CollectionDetails.data &&
            CollectionDetails.data.public && (
              <ClipmateGrid
                data={displayData}
                isFetching={isFetching}
                setCursor={(v) => setCursor(v)}
              />
            )}

          {/* Data - is loaded and data is empty */}
          {!isLoading &&
            (!displayData.data || isEmpty(displayData.data)) &&
            CollectionDetails.data &&
            CollectionDetails.data.public && <SharedCollectionsEmptyState />}

          {/* Data - is loaded but collection is now private */}
          {!isLoading && CollectionDetails.data && !CollectionDetails.data.public && (
            <SharedCollectionsPrivateState />
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowedCollection;
