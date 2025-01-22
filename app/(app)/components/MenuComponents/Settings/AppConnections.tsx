import { env } from "@/lib/env";
import { CircleAlert } from "lucide-react";
import ConnectionItem from "./components/ConnectionItem";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { IClipmateConnection } from "@/types/clipmate";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import ChromeExtensionUpsell from "./components/ChromeExtensionUpsell";
import UpgradeUpsellSettingsDialog from "./components/UpgradeUpsellSettingsDialog";
import { isEmpty } from "lodash";
import ScreenshotUpsell from "./components/ScreenshotUpsell";
import { ScrollArea } from "@/components/ui/scroll-area";

const AppConnections = () => {
  const { user } = FireAuthHooks.useGetUser();
  const { data } = FirestoreHooks.useGetDoc<IClipmateConnection>(["users"], user.uid, {
    key: "getUserInfoForAccessControl",
  });

  const ConnectionsList = [
    {
      type: "twitter",
      label: "Twitter",
      url: env.oauth.twitter_url,
      description: "Sync your saved Twitter/X posts automatically",
    },
    {
      type: "reddit",
      label: "Reddit",
      url: env.oauth.reddit_url,
      description: "Sync your saved Reddit posts automatically",
    },
    {
      type: "github",
      label: "Github",
      url: env.oauth.github_url,
      description: "Sync your starred Github repositories automatically",
    },
  ];

  const hasConnectedApps = ConnectionsList.filter(
    (app) => data && Object.keys(data).includes(app.type)
  );

  return (
    <div className="h-full py-2 px-3">
      <p className="font-medium mb-1">Intergrations</p>
      <p className="text-xs text-muted-foreground mb-1">Connect and sync your bookmarks</p>

      <ScrollArea className="max-h-[530px] pr-1.5">
        {/* <div className="mt-3">
          <UpgradeUpsellSettingsDialog />
        </div> */}

        {!isEmpty(hasConnectedApps) && (
          <div className="flex flex-col gap-2 py-3 mt-3">
            <p className="text-muted-foreground text-xs">Connected</p>

            {ConnectionsList.filter((app) => data && Object.keys(data).includes(app.type)).map(
              (value) => (
                <ConnectionItem key={value.type} value={value} />
              )
            )}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-xs">Extension</p>

          <ChromeExtensionUpsell />
        </div>

        <div className="flex flex-col gap-2 py-3">
          <p className="text-muted-foreground text-xs">Apps</p>

          {ConnectionsList.filter((app) => data && !Object.keys(data).includes(app.type)).map(
            (value) => (
              <ConnectionItem key={value.type} value={value} />
            )
          )}

          <ScreenshotUpsell />
        </div>

        <div className="flex items-start gap-2 border bg-[#FFFAEB] border-[#FEDF89] dark:bg-[#4E1D09]  dark:border-[#93370D] text-[#DC6803] dark:text-[#FDB022] text-xs rounded-lg px-2 py-2 mt-3">
          <CircleAlert size={14} />
          <p>
            We sync your last 100 items during the initial setup. After that, everything syncs
            automatically every 15 minutes
          </p>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AppConnections;
