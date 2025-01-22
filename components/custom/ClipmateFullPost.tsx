import ClipmateResolvedCard from "./ClipmateResolvedCard";
import { ScrollArea } from "../ui/scroll-area";
import useSidebarAtom from "@/stores/SidebarStore";
import ClipmateSidebar from "./ClipmateSidebar";
import { cn } from "@/lib/utils";
import FullPostActions from "./clipmate-full-post/FullPostActions";
import ClipmateFullPostLink from "./clipmate-full-post/FullPostLink";
import ClipmateFullPostPDF from "./clipmate-full-post/FullPostPDF";
import ClipmateFullPostScreenshot from "./clipmate-full-post/FullPostImage";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, Transition, Variants } from "framer-motion";
import { useCommandKContext } from "@/lib/hooks";

const ClipmateFullPost = () => {
  const CMDK = useCommandKContext();
  const { item, open, openDialog, readerMode, collectionsOpen } = useSidebarAtom();
  const [ScrollRef, setScrollRef] = useState<HTMLDivElement | null>(null);

  const defaultVariants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.9,
    },
    animate: {
      opacity: 1,
      scale: 1,
    },
  };

  const defaultTransition: Transition = {
    ease: "easeOut",
    duration: 0.2,
  };

  const isAScreenshot = item?.type === "screenshot";
  const isAPDF = item?.type === "PDF";
  const isALink = item?.type === "link";
  const isNotSpecial = !isAScreenshot && !isAPDF && !isALink;
  const requiresBigScreen = readerMode || isAPDF || isAScreenshot;
  const noBigScreen = !readerMode && !isAPDF && !isAScreenshot;

  /**
   * Keyboard shortcuts for scrolling
   * NB: The timeout delay is to ensure that the element mounted and then
   * that way we can actual get the element reference
   */
  useEffect(() => {
    const Body = document.querySelector("body");
    const Grid = document.querySelector(".clipmate-grid > div");
    if (openDialog) {
      Body?.setAttribute("data-scroll-locked", "1");
      Grid?.setAttribute("data-scroll-locked", "1");
    } else {
      Body?.removeAttribute("data-scroll-locked");
      Grid?.removeAttribute("data-scroll-locked");
    }

    setTimeout(() => {
      const Ref = document.querySelector(".reader > div");
      setScrollRef(Ref as HTMLDivElement);
    }, 250);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (collectionsOpen || CMDK.openDialog) return;

      if (e.key === "ArrowUp") ScrollRef?.scrollBy(0, -25);
      else if (e.key === "ArrowDown") ScrollRef?.scrollBy(0, 25);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [ScrollRef, collectionsOpen, openDialog, CMDK.openDialog]);

  useEffect(() => {
    // Reset the scroll position when the value changes
    ScrollRef?.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);
  /** End of Keyboard shortcut for Scrolling */

  return (
    <AnimatePresence>
      {openDialog && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={defaultVariants}
          transition={defaultTransition}
          className={cn(
            "relative p-2 [&>button]:hidden !ring-0 !outline-none bg-background border border-[#E5E5E5] dark:border-[#292929] rounded-[16px] max-w-lg",
            {
              "min-h-[520px]": !requiresBigScreen,
              "!min-w-fit pr-2": open,
              "!min-w-[calc(100vw-200px)]": !open && requiresBigScreen,
            }
          )}
        >
          <div
            className={cn("grid gap-1.5", {
              "grid-cols-[auto_320px]": open && requiresBigScreen,
              "grid-cols-[500px_320px]": open && noBigScreen,
            })}
          >
            <div className="border-[0.5px] border-[#E5E5E5] dark:border-[#292929] rounded-lg overflow-hidden h-fit">
              <ScrollArea
                className={cn(
                  "w-full max-h-[520px] rounded-lg focus-visible:ring-0 focus-visible:outline-none reader scroll-smooth overflow-hidden",
                  {
                    "min-h-[calc(100vh-120px)] max-h-[calc(100vh-120px)]": requiresBigScreen,
                    "w-[calc(100vw-620px)]": open && requiresBigScreen,
                  }
                )}
                tabIndex={0}
              >
                {isNotSpecial && <ClipmateResolvedCard value={item} inPopupView={openDialog} />}
                {isALink && <ClipmateFullPostLink value={item} />}
                {isAPDF && <ClipmateFullPostPDF value={item} />}
                {isAScreenshot && <ClipmateFullPostScreenshot value={item} />}
              </ScrollArea>
            </div>

            {open && <ClipmateSidebar />}
          </div>

          <div className="absolute top-0 -right-9 z-[99]">
            <FullPostActions />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClipmateFullPost;
