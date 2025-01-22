"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { AccordionContent, AccordionItem, AccordionTrigger2 } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Edit03 } from "@untitled-ui/icons-react";
import { isEmpty } from "lodash";
import Highlight from "./Highlight";
import { Loader2 } from "lucide-react";
import { HighlightValue, IClipmateReaderMode, IClipmateResponse } from "@/types/clipmate";

type Props = {
  itemId: string;
  item: IClipmateResponse;
};

const Highlights = ({ itemId, item }: Props) => {
  const { user } = FireAuthHooks.useGetUser();
  const { data, isLoading } = FirestoreHooks.useGetDoc<IClipmateReaderMode>(
    ["users", user.uid, "reader"],
    itemId,
    { key: itemId }
  );

  const SortFn = (a: HighlightValue, b: HighlightValue) => {
    if (a.start < b.start) return -1;
    if (a.start > b.start) return 1;
    return 0;
  };

  return (
    <AccordionItem value="highlights" className="!border-none">
      <AccordionTrigger2 className="px-3 no-underline hover:!no-underline">
        <div className="flex items-center gap-2 text-sm">
          <Edit03 width={16} />
          <p>Highlights</p>
          <Badge variant="outline" className="rounded-full">
            {isLoading ? "..." : data?.highlights?.length || 0}
          </Badge>
        </div>
      </AccordionTrigger2>

      <AccordionContent className="w-full flex flex-col items-center gap-2 px-2 pb-0">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 w-full h-28 rounded-md">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Loading highlights...</span>
          </div>
        )}

        <div className="w-full grid items-center gap-2 pb-2">
          {!isLoading &&
            data &&
            !isEmpty(data.highlights) &&
            data.highlights
              .sort(SortFn)
              .map((hl, index) => (
                <Highlight key={hl.color + index} highlight={hl} value={data} item={item} />
              ))}
        </div>

        {!isLoading && isEmpty(data?.highlights) && (
          <div className="flex items-center justify-center h-10 w-full text-center">
            <p className="text-xs text-[#525252] dark:text-[#A3A3A3]">
              No highlights for this item
            </p>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default Highlights;
