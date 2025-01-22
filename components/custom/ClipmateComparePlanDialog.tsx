import { DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { HelpCircle, Minus } from "@untitled-ui/icons-react";
import PlansCheckIcon from "../icons/plans-check";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const ClipmateComparePlanDialog = () => {
  const Includes = [
    {
      text: "Auto-sync sources",
      description:
        "Auto-sync bookmarks and read-later items from Twitter, Reddit, iOS Screenshots, Github, and more",
      plans: [
        { name: "Free", included: false },
        { name: "Essential", included: true },
        { name: "Pro", included: true },
      ],
    },
    {
      text: "Save unlimited items",
      description:
        "Away with the 25 item per month limit. Add as many items as you want to Clipmate AI",
      plans: [
        { name: "Free", included: false, value: "25" },
        { name: "Essential", included: true },
        { name: "Pro", included: true },
      ],
    },
    {
      text: "iOS Share sheet",
      description:
        "Add links, screenshots, Tweets, Reddit posts and more to Clipmate using the iOS share sheet",
      plans: [
        { name: "Free", included: true },
        { name: "Essential", included: true },
        { name: "Pro", included: true },
      ],
    },
    {
      text: "Web app",
      description: "Browse all of your saved and read-later items using the Clipmate web app",
      plans: [
        { name: "Free", included: true },
        { name: "Essential", included: true },
        { name: "Pro", included: true },
      ],
    },
    {
      text: "Reader mode",
      description:
        "Reader mode strips ads and trackers for a distraction-free reading experience",
      plans: [
        { name: "Free", included: false },
        { name: "Essential", included: true },
        { name: "Pro", included: true },
      ],
    },
    {
      text: "Cloud sync",
      description: "Sync your saved items between iOS and web in realtime.",
      plans: [
        { name: "Free", included: false },
        { name: "Essential", included: true },
        { name: "Pro", included: true },
      ],
    },
    {
      text: "AI summaries",
      description: "Use AI to summarise PDFs, articles, Reddit posts and Tweets",
      plans: [
        { name: "Free", included: false },
        { name: "Essential", included: true },
        { name: "Pro", included: true },
      ],
    },
    {
      text: "Access to Beta features",
      description: "Get access to the newest features before they role out to free users",
      plans: [
        { name: "Free", included: false },
        { name: "Essential", included: true },
        { name: "Pro", included: true },
      ],
    },
  ];

  const MINUS = "text-[#A4A7AE] dark:text-[#85888E]";
  const VAL = "text-[#535862] dark:text-[#94979C]";
  const HELP = "text-[#A3A3A3] dark:text-[#737373]";

  return (
    <DialogContent className="focus-visible:outline-none focus-visible:ring-0 px-0 pb-0 rounded-xl max-w-[468px]">
      <div className="flex flex-col gap-2 justify-center items-center text-center px-10">
        {/** Heading */}
        <div className="grid gap-2">
          <p className="text-sm font-semibold">Compare Plans</p>
          <p className="text-sm text-muted-foreground">
            Explore our three plans to find your ideal match! Select the plan that fits your
            needs!
          </p>
        </div>
      </div>

      {/** Features */}
      <div className="w-full grid gap-3">
        <div className="grid grid-cols-[auto_65px_65px_65px] text-sm text-center font-semibold text-[#501E11] dark:text-foreground">
          <p></p>
          <p>Free</p>
          <p>Essential</p>
          <p>Pro</p>
        </div>

        <div>
          {Includes.map((features, index) => (
            <div
              key={index}
              className={cn("grid grid-cols-[auto_65px_65px_65px] text-sm h-16 pl-4", {
                "bg-background": (index + 1) % 2 !== 0,
              })}
            >
              <div className="flex items-center gap-2 font-medium">
                <p>{features.text}</p>
                <Popover>
                  <PopoverTrigger>
                    <HelpCircle width={15} className={HELP} />
                  </PopoverTrigger>
                  <PopoverContent side="right" className="text-xs text-center max-w-[250px] py-2">
                    {features.description}
                  </PopoverContent>
                </Popover>
              </div>

              {features.plans.map((plan, index) => (
                <div key={index} className="w-full h-full flex items-center justify-center">
                  {!plan.included && plan.value && <p className={VAL}>{plan.value}</p>}
                  {!plan.included && !plan.value && <Minus width={24} className={MINUS} />}
                  {plan.included && !plan.value && <PlansCheckIcon width={24} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DialogContent>
  );
};

export default ClipmateComparePlanDialog;
