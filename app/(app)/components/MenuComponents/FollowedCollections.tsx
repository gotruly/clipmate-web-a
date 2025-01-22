import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IClipmateFollowing } from "@/types/clipmate";
import { where } from "firebase/firestore";
import FollowedCollectionItem from "./FollowedCollectionItem";
import useFollowedCollectionDetailsStore from "@/stores/FollowedCollectionDetailsStore";
import { useEffect } from "react";
import LinkLoading from "./LinkLoading";

const FollowedCollections = () => {
  const { handleAddCollectionsDetails } = useFollowedCollectionDetailsStore();
  const { user } = FireAuthHooks.useGetUser();
  const { data, isLoading } = FirestoreHooks.useGetManyDocs<IClipmateFollowing>(
    ["collections_follow"],
    {
      key: "getAllFollowedCollections",
      constraints: [where("user_id", "==", user.uid)],
    }
  );

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
            <AccordionTrigger className="no-underline hover:no-underline py-2">
              <p className="text-xs">Followed Collections</p>
            </AccordionTrigger>
          </div>

          <AccordionContent className="flex flex-col gap-[1px]">
            {!isLoading &&
              data &&
              data.map((collection) => (
                <FollowedCollectionItem key={collection._id} collection={collection} />
              ))}

            {isLoading && <LinkLoading />}

            {!isLoading && data && data.length === 0 && null}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FollowedCollections;
