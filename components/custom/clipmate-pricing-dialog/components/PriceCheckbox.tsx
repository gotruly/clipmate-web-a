"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, formatCurrency } from "@/lib/utils";
import { Package } from "@revenuecat/purchases-js";

interface Essential extends React.HTMLProps<HTMLInputElement> {
  price: Package;
}

const PriceCheckbox = ({ price, ...rest }: Essential) => {
  const INTERVAL = price.rcBillingProduct.defaultSubscriptionOption?.base.period?.unit;
  const AMOUNT = price.rcBillingProduct.currentPrice.amountMicros;
  const CURRENCY = price.rcBillingProduct.currentPrice.currency;

  return (
    <Label className="w-full h-[82px] flex flex-col justify-center items-center space-y-1 py-4 pt-5 border border-border rounded-[16px] bg-white dark:bg-background has-[:checked]:border-primary has-[:checked]:ring-4 has-[:checked]:ring-primary/30 cursor-pointer drop-shadow-sm">
      <p className="font-semibold capitalize text-[10px] text-[#525252] dark:text-[#D6D6D6]">{`${INTERVAL}ly`}</p>

      <p className="font-semibold text-sm">
        {INTERVAL === "year"
          ? formatCurrency(AMOUNT / 1000000 / 12, CURRENCY)
          : formatCurrency(AMOUNT / 1000000, CURRENCY)}
        <span>/mo</span>
      </p>

      <p
        className={cn(
          "hidden font-semibold text-[10px] text-[#525252] dark:text-[#A3A3A3] space-x-0.5",
          {
            block: INTERVAL === "year",
          }
        )}
      >
        <span>{formatCurrency(AMOUNT / 1000000, CURRENCY)}</span>
        <span>{INTERVAL}ly</span>
      </p>

      <Input className="invisible w-0 h-0" type="radio" name="price" {...rest} />
    </Label>
  );
};

export default PriceCheckbox;
