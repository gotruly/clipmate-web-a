import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useCollectionsContext } from "@/lib/hooks";
import { IClipmateCollections } from "@/types/clipmate";
import { Plus } from "@untitled-ui/icons-react";
import CollectionItem from "./CollectionItem";
import { where } from "firebase/firestore";
import React, { useCallback, useEffect } from "react";
import useCollectionDetailsStore from "@/stores/CollectionDetailsStore";
import LinkLoading from "./LinkLoading";
import OnDropToCollectionProvider from "@/providers/OnDropToCollectionProvider";

const Collections = React.memo(() => {
  const { store, handleAddCollectionsDetails } = useCollectionDetailsStore();
  const { setOpenDialog } = useCollectionsContext();
  const { user } = FireAuthHooks.useGetUser();
  const { data, isLoading } = FirestoreHooks.useGetManyDocs<IClipmateCollections>(
    ["collections"],
    {
      key: "getAllCollections",
      constraints: [where("user_id", "==", user.uid)],
    }
  );

  const SortFn = useCallback((a: IClipmateCollections, b: IClipmateCollections) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }, []);

  // Cache Collection Details - for faster response on navigating to collection page
  useEffect(() => {
    handleAddCollectionsDetails(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="flex flex-col pl-4">
      <Accordion type="single" collapsible defaultValue="all">
        <AccordionItem value="all" className="border-none group">
          <div className="flex items-center justify-between text-muted-foreground">
            <AccordionTrigger className="no-underline hover:no-underline py-2 text-[#525252] dark:text-[#A3A3A3] pb-0.5">
              <p className="text-xs">Your Collections</p>
            </AccordionTrigger>

            <Button
              variant="ghost"
              className="p-0 !bg-transparent text-[#525252] dark:text-[#A3A3A3] h-fit opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setOpenDialog(true)}
            >
              <Plus width={16} />
            </Button>
          </div>

          <AccordionContent className="flex flex-col gap-[1px]">
            {!isLoading &&
              store &&
              Object.values(store)
                .sort(SortFn)
                .map((collection) => (
                  <OnDropToCollectionProvider key={collection._id} collection={collection}>
                    <CollectionItem collection={collection} />
                  </OnDropToCollectionProvider>
                ))}

            {isLoading && <LinkLoading />}
            {!isLoading && data && data.length === 0 && null}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
});

Collections.displayName = "Collections";

export default Collections;
