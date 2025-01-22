import IconPicker from "@/components/custom/IconPicker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname } from "next/navigation";
import SourcesItem from "./SourcesItem";

const Sources = () => {
  const SourceList = [
    { name: "Link", type: "link", href: "/link" },
    { name: "Reddit", type: "reddit", href: "/reddit" },
    {
      name: "X/Twitter",
      type: "twitter",
      href: "/twitter",
    },
    { name: "Github", type: "github", href: "/github" },
    {
      name: "Screenshots",
      type: "screenshot",
      href: "/screenshot",
    },
    { name: "PDF", type: "PDF", href: "/PDF" },
  ];

  return (
    <div className="flex flex-col gap-[1px] pl-4">
      <Accordion type="single" collapsible defaultValue="sources">
        <AccordionItem value="sources" className="border-none group">
          <div className="flex items-center justify-between">
            <AccordionTrigger className="w-full no-underline hover:no-underline py-2 text-[#525252] dark:text-[#A3A3A3] pb-0.5">
              <p className="text-xs">Sources</p>
            </AccordionTrigger>
          </div>

          <AccordionContent className="flex flex-col gap-[1px]">
            {SourceList.map((source, index) => (
              <SourcesItem key={index} source={source} />
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Sources;
