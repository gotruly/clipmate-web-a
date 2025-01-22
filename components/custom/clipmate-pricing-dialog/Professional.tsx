"use client";

import FirestoreHooks from "@/app/api/hooks/firestore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { cn, formatCurrency } from "@/lib/utils";
import { IClipmatePrice } from "@/types/clipmate";
import { where } from "firebase/firestore";
import { isEmpty } from "lodash";
import { useState } from "react";
import SelectionWrapper from "./SelectionWrapper";
import { Button } from "@/components/ui/button";
import { useSubscriptionContext } from "@/lib/hooks";
import PriceCheckbox from "./components/PriceCheckbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ESSENTIAL_FEATURES, PRO_FEATURES } from "./utils";
import { Card, CardContent } from "@/components/ui/card";
import FeatureItem from "./components/FeatureItem";
import ClipmateDivider from "../ClipmateDivider";

const Professional = () => {
  const { isLoading, handleCheckout } = useSubscriptionContext();

  const [priceId, setPriceId] = useState<string | undefined>();
  const { data } = FirestoreHooks.useGetManyDocs<IClipmatePrice>(
    ["products", "prod_QV3kJlHt1XbOUW", "prices"],
    {
      key: "getProductPrices",
      constraints: [where("interval", "!=", "day")],
    }
  );

  const PILL =
    "bg-primary py-[1px] px-2.5 rounded-full top-0 left-1/2 translate-x-[-50%] translate-y-[-50%] absolute z-10 hidden";
  const monthly = Number(data?.find((price) => price.interval === "month")?.unit_amount) / 100;
  const per_month = monthly * 12;
  const yearly = Number(data?.find((price) => price.interval === "year")?.unit_amount) / 100;
  const percentage = (((per_month - yearly) / per_month) * 100).toFixed(2);

  return (
    <TabsContent className="relative h-[calc(100vh-280px)]" value="pro">
      <div className="h-[calc(100vh-510px)]">
        <ScrollArea className="h-full px-2">
          <Card>
            <CardContent className="px-4">
              <p className="text-sm text-center text-[#424242] dark:text-[#D6D6D6] py-3 font-semibold">
                Clipmate Professional includes
              </p>

              {PRO_FEATURES.map((feature, index) => (
                <FeatureItem key={index} feature={feature} />
              ))}

              <ClipmateDivider bgClass="!bg-card">
                <p className="uppercase text-[9px] font-medium">Everything in Essential</p>
              </ClipmateDivider>

              {ESSENTIAL_FEATURES.map((feature, index) => (
                <FeatureItem key={index} feature={feature} />
              ))}
            </CardContent>
          </Card>
        </ScrollArea>
      </div>

      <SelectionWrapper>
        {data && !isEmpty(data) && (
          <div className="w-full h-full flex items-center gap-3 mt-3">
            {data.map((price, index) => (
              <div key={index} className="relative w-full">
                <div className={cn(PILL, { block: price.interval === "year" })}>
                  <p className="text-[10px] font-semibold text-white">Save {percentage}%</p>
                </div>
                {/* <PriceCheckbox
                  price={price}
                  defaultValue={price._id}
                  checked={price._id === priceId}
                  onChange={(e) => setPriceId(e.currentTarget.value)}
                /> */}
              </div>
            ))}
          </div>
        )}

        <Button
          size="default"
          className="w-full"
          disabled={!priceId || isLoading}
          onClick={() => handleCheckout(priceId)}
        >
          Start Professional
        </Button>
      </SelectionWrapper>
    </TabsContent>
  );
};

export default Professional;
