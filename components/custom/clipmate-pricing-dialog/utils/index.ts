import { Package } from "@revenuecat/purchases-js";
import {
  Atom02,
  BookOpen01,
  CloudBlank01,
  Infinity as InfinityIcon,
  Laptop01,
  RefreshCw02,
  Share01,
  Star02,
} from "@untitled-ui/icons-react";

const PRO_FEATURES = [
  {
    text: "Auto-sync sources",
    description:
      "Auto-sync bookmarks and read-later items from Twitter, Reddit, iOS Screenshots, Github, and more",
    icon: RefreshCw02,
    color: "#36BFFA",
  },
];

const ESSENTIAL_FEATURES = [
  {
    text: "Save unlimited items",
    description:
      "Away with the 25 item per month limit. Add as many items as you want to Clipmate AI",
    icon: InfinityIcon,
    color: "#FF6038",
  },
  {
    text: "iOS Share sheet",
    description:
      "Add links, screenshots, Tweets, Reddit posts and more to Clipmate using the iOS share sheet",
    icon: Share01,
    color: "#FDB022",
  },
  {
    text: "Web app",
    description: "Browse all of your saved and read-later items using the Clipmate web app",
    icon: Laptop01,
    color: "#17B26A",
  },
  {
    text: "Reader mode",
    description: "Reader mode strips ads and trackers for a distraction-free reading experience",
    icon: BookOpen01,
    color: "#0BA5EC",
  },
  {
    text: "Cloud sync",
    description: "Sync your saved items between iOS and web in realtime.",
    icon: CloudBlank01,
    color: "#7A5AF8",
  },
  {
    text: "AI summaries",
    description: "Use AI to summarise PDFs, articles, Reddit posts and Tweets",
    icon: Star02,
    color: "#D444F1",
  },
  {
    text: "Access to Beta features",
    description: "Get access to the newest features before they role out to free users",
    icon: Atom02,
    color: "#4E5BA6",
  },
];

const FindMonthly = (pckgs?: Package[]): number => {
  return (
    Number(
      pckgs?.find(
        (price) => price.rcBillingProduct.defaultSubscriptionOption?.base.period?.unit === "month"
      )?.rcBillingProduct.currentPrice.amountMicros
    ) / 1000000
  );
};

const FindYearly = (pckgs?: Package[]): number => {
  return (
    Number(
      pckgs?.find(
        (price) => price.rcBillingProduct.defaultSubscriptionOption?.base.period?.unit === "year"
      )?.rcBillingProduct.currentPrice.amountMicros
    ) / 1000000
  );
};

export { PRO_FEATURES, ESSENTIAL_FEATURES, FindMonthly, FindYearly };
