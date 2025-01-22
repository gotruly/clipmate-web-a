"use client";

import FireAuthHooks from "@/app/api/hooks/fireauth";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard02, CreditCardRefresh, Wallet03 } from "@untitled-ui/icons-react";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import FirestoreHooks from "@/app/api/hooks/firestore";
import { IClipmateConnection, IClipmateInvoices, IClipmatePrice } from "@/types/clipmate";
import { useSubscriptionContext } from "@/lib/hooks";
import UpgradeUpsellSettingsDialog2 from "./components/UpgradeUpsellSettingsDialog2";
import { Badge } from "@/components/ui/badge";
import FreePlanLimit from "./components/FreePlanLimit";
import { limit, orderBy, Timestamp } from "firebase/firestore";
import { CircleAlert } from "lucide-react";
import ComparePlansDialog from "./components/ComparePlans";
import React from "react";
import { useRevenueCat } from "@/app/api/hooks/rc";
import Link from "next/link";

const Billing = React.memo(() => {
  const { useGetCustomer, useGetOfferings } = useRevenueCat();
  const { isLoading, isPremium, handleManageSubscription } = useSubscriptionContext();

  const { user } = FireAuthHooks.useGetUser();
  const { data } = FirestoreHooks.useGetDoc<IClipmateConnection>(["users"], user.uid, {
    key: "getUserInfoForAccessControl",
  });
  const Prices = FirestoreHooks.useGetManyDocs<IClipmatePrice>(
    ["products", "prod_QV3kJlHt1XbOUW", "prices"],
    {
      key: "getProductPrices",
    }
  );
  const Invoices = FirestoreHooks.useGetManyDocs<IClipmateInvoices>(
    ["customers", user.uid, "invoices"],
    {
      key: "getUserInvoices",
      constraints: [limit(5), orderBy("created", "desc")],
    }
  );

  const Customer = useGetCustomer();
  const Offerings = useGetOfferings();

  const ConvertTimeStamp = (date: Timestamp) => {
    const converted = new Date(date.seconds * 1000);
    return formatDate(converted);
  };

  const ConvertPriceIdToAmount = (priceId: string) => {
    return Prices.data?.find((price) => price._id === priceId)?.unit_amount || 0;
  };

  const DATA = Customer.data;
  const MANAGEMENT_URL = DATA && DATA.managementURL;
  const PLAN = DATA && DATA.entitlements.active.essential;
  const OFFERINGS = Offerings.data;
  const PACKAGES = OFFERINGS && OFFERINGS.current && OFFERINGS.current.availablePackages;
  const ACTIVE = PACKAGES?.find(
    (pkg) => pkg.rcBillingProduct.identifier === PLAN?.productIdentifier
  );
  const AMOUNT = ACTIVE?.rcBillingProduct.currentPrice.amountMicros;
  const PERIOD = ACTIVE?.rcBillingProduct.defaultSubscriptionOption?.base.period?.unit;

  return (
    <>
      <div className="h-fit mt-2 mx-3 bg-white dark:bg-background border border-border rounded-lg overflow-hidden p-0">
        <div className="w-full flex items-start justify-between bg-[#F5F5F5] dark:bg-accent_a p-3">
          <div className="flex items-center gap-2">
            <p className="font-medium capitalize">
              {isPremium || (data && data.is_pro) ? PLAN?.identifier : "Free"}
            </p>
            <Badge
              className="bg-[#FAFAFA] dark:bg-background border border-[#E5E5E5] dark:border-[#424242]"
              variant="outline"
            >
              {PLAN?.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>

          <p className="font-medium">
            {formatCurrency((AMOUNT || 0) / 1000000)}/{PERIOD}
          </p>
        </div>

        <div className={cn("hidden", { block: isPremium || (data && !data.is_pro) })}>
          <FreePlanLimit />
        </div>

        <div
          className={cn("flex-col gap-1 text-sm p-3 font-medium hidden", {
            flex: isPremium || (data && data.is_pro),
          })}
        >
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <CreditCardRefresh width={16} />
            </span>
            <span>
              Frequency:{" "}
              <span className="font-semibold capitalize">
                {isPremium || (data && data.is_pro) ? PERIOD + "ly" : "None"}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Calendar width={16} />
            </span>
            <span>
              Next billing date:{" "}
              {PLAN?.expirationDate && (
                <span className="font-semibold">{formatDate(new Date(PLAN.expirationDate))}</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Wallet03 width={16} />
            </span>
            <span>
              Amount:{" "}
              <span className="font-semibold">{formatCurrency((AMOUNT || 0) / 1000000)}</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 text-muted-foreground">
              <CreditCard02 width={16} />
            </span>
            <span>
              Payment method: <span className="font-semibold">Stripe</span>
            </span>
          </div>
        </div>

        <div className="w-full flex items-center gap-2 pt-0 p-3">
          <ComparePlansDialog isLoading={isLoading} />
          <Button
            size="sm"
            className={cn("w-full h-8 hidden", { block: isPremium || (data && data.is_pro) })}
            disabled={isLoading}
          >
            <Link href={MANAGEMENT_URL || "#"} target="_blank">
              Manage Subscription
            </Link>
          </Button>
        </div>
      </div>

      <>
        {Invoices && Invoices.data && (
          <div className="mt-2 mx-3 bg-white dark:bg-background border border-border rounded-lg overflow-hidden p-0">
            <div className="flex items-center gap-2 p-3">
              <p className="font-semibold">Invoices</p>
            </div>

            <div className="grid grid-cols-[auto_160px_100px] px-3 py-2 bg-card text-xs font-medium">
              <p>Invoice</p>
              <p>Billing Date</p>
              <p>Amount</p>
            </div>

            {Invoices &&
              Invoices.data &&
              Invoices.data.map((invoice) => (
                <div
                  key={invoice._id}
                  className="bg-white dark:bg-background grid grid-cols-[auto_160px_100px] px-3 py-3 text-[13px]"
                >
                  <p className="font-semibold">{invoice._id}</p>
                  <p className="text-muted-foreground">{ConvertTimeStamp(invoice.created)}</p>
                  <p className="text-muted-foreground">
                    USD {formatCurrency(ConvertPriceIdToAmount(invoice.price) / 100)}
                  </p>
                </div>
              ))}
          </div>
        )}
      </>

      <div
        className={cn(
          "items-start gap-2 bg-yellow-500/30 text-yellow-600 border border-yellow-600 text-xs rounded-lg px-2 py-2 mt-3 mx-3 hidden",
          { flex: isPremium && data && data.is_pro && !Invoices.data }
        )}
      >
        <CircleAlert size={14} />
        <p>
          Looks like you bought this subscription on another device. You&apos;ll need to manage or
          cancel your subscription from that platform.
        </p>
      </div>

      <div className={cn("hidden mt-2 mx-3", { block: isPremium || (data && !data.is_pro) })}>
        <UpgradeUpsellSettingsDialog2 description="Unlock Auto-sync sources (YouTube, Reddit, Twitter, Github, Screenshots)" />
      </div>
    </>
  );
});

Billing.displayName = "Billing";

export default Billing;
