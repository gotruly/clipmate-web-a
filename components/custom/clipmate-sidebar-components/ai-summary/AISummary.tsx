"use client";

import { AccordionContent, AccordionItem, AccordionTrigger2 } from "@/components/ui/accordion";
import { Stars01 } from "@untitled-ui/icons-react";

type Props = {
  summary: string;
};

const AISummary = ({ summary }: Props) => {
  return (
    <AccordionItem value="ai_summary" className="!border-none">
      <AccordionTrigger2 className="px-3 no-underline hover:!no-underline">
        <div className="flex items-center gap-2 text-sm">
          <Stars01 width={16} />
          <p>AI Summary</p>
        </div>
      </AccordionTrigger2>

      <AccordionContent className="flex flex-col items-center gap-2 px-4 pb-4">
        <div className="pb-2 w-full">
          <p className="text-wrap text-sm">{summary}</p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default AISummary;
