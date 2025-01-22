"use client";

import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { isEmpty } from "lodash";
import { useState } from "react";
import SelectionWrapper from "./SelectionWrapper";
import { Button } from "@/components/ui/button";
import PriceCheckbox from "./components/PriceCheckbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { ESSENTIAL_FEATURES, FindMonthly, FindYearly } from "./utils";
import { useRevenueCat } from "@/app/api/hooks/rc";
import { Package } from "@revenuecat/purchases-js";

const Essential = () => {
  const { useGetOfferings, useHandlePurchase } = useRevenueCat();

  const [pckg, setPckg] = useState<Package | undefined>();

  const Offerings = useGetOfferings();
  const { mutate, isPending } = useHandlePurchase();

  const PILL =
    "bg-primary py-[1px] px-2.5 rounded-full -top-[1px] left-1/2 translate-x-[-50%] translate-y-[-50%] absolute z-10 hidden";
  const PACKAGE = Offerings?.data?.current?.availablePackages;
  const monthly = FindMonthly(PACKAGE);
  const per_month = monthly * 12;
  const yearly = FindYearly(PACKAGE);
  const percentage = (((per_month - yearly) / per_month) * 100).toFixed(2);

  const Buy = () => {
    pckg && mutate(pckg);
  };

  return (
    <TabsContent className="relative h-[calc(100vh-280px)]" value="essential">
      <div className="h-[calc(100vh-510px)]">
        <ScrollArea className="h-full px-2">
          <Card>
            <CardContent className="px-4">
              <p className="text-sm text-center text-[#424242] dark:text-[#D6D6D6] py-3 font-semibold">
                Clipmate Essential includes
              </p>

              {ESSENTIAL_FEATURES.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 space-y-3 space-y-reverse mt-2"
                >
                  <div
                    className="p-2 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: feature.color }}
                  >
                    <feature.icon width={18} height={18} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{feature.text}</p>
                    <p className="text-xs text-[#A3A3A3]">{feature.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </ScrollArea>
      </div>

      <SelectionWrapper>
        {Offerings.data && !isEmpty(Offerings.data) && (
          <div className="w-full flex items-center gap-3 mt-3">
            {Offerings.data.current &&
              !isEmpty(Offerings.data.current.availablePackages) &&
              [...Offerings.data.current.availablePackages].reverse().map((price, index) => (
                <div key={index} className="relative w-full">
                  <div
                    className={cn(PILL, {
                      block: price.identifier === "$rc_annual" && percentage !== "0.00",
                    })}
                  >
                    <p className="text-[10px] font-semibold text-white">Save {percentage}%</p>
                  </div>
                  <PriceCheckbox
                    price={price}
                    defaultValue={price.rcBillingProduct.identifier}
                    checked={
                      price.rcBillingProduct.identifier === pckg?.rcBillingProduct.identifier
                    }
                    onChange={() => setPckg(price)}
                  />
                </div>
              ))}
          </div>
        )}

        <Button
          size="default"
          className="w-full"
          disabled={!pckg || isPending}
          onClick={() => Buy()}
        >
          Start Essential
        </Button>
      </SelectionWrapper>
    </TabsContent>
  );
};

export default Essential;
