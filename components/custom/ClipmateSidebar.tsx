"use client";

import { cn, formatDate } from "@/lib/utils";
import { Accordion } from "../ui/accordion";
import Notes from "./clipmate-sidebar-components/notes/Notes";
import { ScrollArea } from "../ui/scroll-area";
import AISummary from "./clipmate-sidebar-components/ai-summary/AISummary";
import useSidebarAtom from "@/stores/SidebarStore";
import Highlights from "./clipmate-sidebar-components/highlights/Highlights";
import { useState } from "react";

const ClipmateSidebar = () => {
  const { item, open, readerMode } = useSidebarAtom();
  const isNotHighlightable =
    item?.type === "PDF" || item?.type === "screenshot" || item?.type === "github";

  const [activeAccordion, setActiveAccordion] = useState<string[]>([]);

  return (
    <>
      {open && (
        <div className="sidebar h-full w-[320px] rounded-lg overflow-hidden bg-white dark:bg-card border-[0.5px] border-[#E5E5E5] dark:border-border">
          <ScrollArea
            className={cn("!w-full rounded-lg", {
              "min-h-[520px] max-h-[520px]": item?.type !== "PDF" && !readerMode,
              "max-h-[calc(100vh-120px)]": item?.type === "PDF" || readerMode,
            })}
          >
            <div className="w-full">
              <Accordion
                type="multiple"
                defaultValue={activeAccordion}
                onValueChange={(v) => setActiveAccordion(v)}
              >
                {item && item.data.summary && <AISummary summary={item.data.summary} />}
                {item && <Notes itemId={item._id} open={activeAccordion} />}
                {item && !isNotHighlightable && <Highlights itemId={item._id} item={item} />}
              </Accordion>
            </div>

            {item && (
              <div className="px-2 py-3 space-y-3">
                <p className="text-xs text-[#525252] dark:text-[#A3A3A3] flex items-center justify-center gap-0.5 text-center">
                  Saved on
                  <span>{formatDate(new Date(item.date_added.seconds * 1000))},</span>
                  <span>{new Date(item.date_added.seconds * 1000).toLocaleTimeString()}</span>
                </p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </>
  );
};

export default ClipmateSidebar;
