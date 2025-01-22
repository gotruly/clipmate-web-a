"use client";

import IconPicker from "@/components/custom/IconPicker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TabContextItem } from "@/types/context";
import { Bookmark, X } from "lucide-react";
import { useState } from "react";
import Home from "./Home";

const MainView = () => {
  const [TabsLists, setTabsLists] = useState<TabContextItem[]>([]);

  const [tabs, setSelectedTabs] = useState<string>("all");

  const handleRemoveTab = (id: string) => {
    setTabsLists((prev) => prev.filter((tab) => tab.id !== id));
    setSelectedTabs("all");
  };

  return (
    <Tabs value={tabs} onValueChange={setSelectedTabs}>
      {/* Home TabTrigger - This is where all things are shown and it's the default tab - never closed */}
      <TabsList className="w-full h-fit p-0 justify-start xl:justify-center">
        <TabsTrigger
          disabled={true}
          className="w-full h-7 m-0 flex items-center gap-2 !opacity-100 !bg-white dark:!bg-secondary rounded-lg"
          value="all"
        >
          <Bookmark size={16} />
          <p className="text-xs text-ellipsis overflow-hidden xl:block w-fit">All Items</p>
        </TabsTrigger>

        {/* TabsTrigger for each source - mainly post expanded from ClipmateCard */}
        {TabsLists.map((tab) => (
          <TabsTrigger
            className="h-7 m-0 flex items-center w-full gap-2 group"
            value={tab.id}
            key={tab.id}
          >
            <IconPicker type={tab.type} />
            <p className="text-xs text-ellipsis overflow-hidden xl:block truncate w-full">
              {tab.title}
            </p>
            <div
              className="self-end w-[16px] h-[16px] cursor-pointer"
              onClick={() => handleRemoveTab(tab.id)}
            >
              <X size={16} className="hidden group-hover:block" />
            </div>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Home Tab - This is where all things are shown and it's the default tab - never closed */}
      <TabsContent
        className="h-full focus-visible:ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        value="all"
      >
        <Home />
      </TabsContent>

      {/* Tabs for each source - mainly post expanded from ClipmateCard */}
      {TabsLists.map((tab) => (
        <TabsContent
          className="h-full pt-2 focus-visible:ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          value={tab.id}
          key={tab.id}
        >
          <>{tab.id}</>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default MainView;
