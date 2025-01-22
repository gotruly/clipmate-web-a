"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
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
import { IClipmateCollections } from "@/types/clipmate";
import { useState } from "react";
import CollectionOptions from "../../components/options";
import { usePaginatedPageContext } from "@/lib/hooks";
import CollectionsEmptyState from "../../components/empty-state";
import { isEmpty } from "lodash";
import { notFound } from "next/navigation";
import { Folder, Share05 } from "@untitled-ui/icons-react";
import ShareDialog from "../../components/share-form";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import VisibilityIndicator from "../../components/visibility-indicator";
import TimeoutWrapper from "@/components/custom/TimeoutWrapper";
import LoadingScreen from "@/components/custom/clipmate-loading-screens/LoadingScreen";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";

const Collection = ({ params }: { params: { id: string } }) => {
  const DetailsStore = useCollectionDetailsStore();

  const { user } = FireAuthHooks.useGetUser();

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const CollectionDetails = FirestoreHooks.useGetDoc<IClipmateCollections>(
    ["collections"],
    params.id,
    {
      key: "getAllCollectionsDetails",
      placeholder: DetailsStore.store[params.id],
      gcTime: Infinity,
    }
  );

  if (!CollectionDetails.isLoading && !CollectionDetails.data?.name) {
    notFound();
  }

  const { isLoading, isFetching, displayData, setCursor } = usePaginatedPageContext();

  return (
    <div className={cn("w-full h-[calc(100vh-20px)] overflow-hidden")}>
      <div
        className={cn(
          "w-full h-[calc(100vh-20px)] flex-1 rounded-md border-[0.5px] border-border overflow-hidden z-10 will-change-[width]"
        )}
      >
        <div className="flex flex-col items-start justify-between border-b-[0.5px] border-border px-3 pt-3 bg-card h-[150px]">
          {CollectionDetails.isLoading && <Skeleton className="h-3 w-24" />}
          {!CollectionDetails.isLoading && CollectionDetails.data && (
            <Breadcrumb>
              <BreadcrumbList className="sm:gap-1">
                <BreadcrumbPage className="text-muted-foreground">
                  Your Collections
                </BreadcrumbPage>
                <BreadcrumbSeparator />
                <BreadcrumbPage className="text-sm">{CollectionDetails.data.name}</BreadcrumbPage>
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
                <>
                  {CollectionDetails.isLoading && <Skeleton className="h-6 w-50" />}
                  {CollectionDetails.data && (
                    <VisibilityIndicator visibility={CollectionDetails.data.public} />
                  )}
                </>
              </div>

              <div className="flex items-center gap-1">
                {CollectionDetails.data && CollectionDetails.data.user_id === user.uid && (
                  <>
                    <Dialog open={dialogOpen} onOpenChange={(b) => setDialogOpen(b)}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full flex items-center gap-2 h-8"
                        >
                          <Share05 width={16} height={16} />
                          Share
                        </Button>
                      </DialogTrigger>
                      <ShareDialog
                        collection={CollectionDetails.data}
                        setOpen={(b) => setDialogOpen(b)}
                      />
                    </Dialog>

                    <CollectionOptions collection={CollectionDetails.data} />
                  </>
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
          {isLoading && <LoadingScreen count={DetailsStore.store[params.id]?.count} />}

          {/* Data - is loaded and data is not empty */}
          {displayData.data && !isEmpty(displayData.data) && (
            <ClipmateGrid
              data={displayData}
              isFetching={isFetching}
              setCursor={(v) => setCursor(v)}
            />
          )}

          {/* Data - is loaded and data is empty */}
          {!isLoading && (!displayData.data || isEmpty(displayData.data)) && (
            <TimeoutWrapper>
              <CollectionsEmptyState />
            </TimeoutWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
