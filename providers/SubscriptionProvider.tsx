import SubscriptionContext from "@/context/SubscriptionContext";
import { useCallback, useMemo, useState } from "react";
import { useDBListener, useSubscriptionListener } from "@/lib/hooks";
import FireAuthHooks from "@/app/api/hooks/fireauth";
import { where } from "firebase/firestore";
import { captureException } from "@sentry/nextjs";
import { toast } from "sonner";
import { getCheckoutUrl, getPortalUrl } from "@/app/api/stripe/stripePayment";
import { useRouter } from "next/navigation";
import useGlobalStore from "@/stores/GlobalStore";
import useSourcesStore from "@/stores/SourcesStore";
import { isEmpty } from "lodash";
import { IClipmateBase } from "@/types/clipmate";
import useInitialRevenueCat, { useRevenueCat } from "@/app/api/hooks/rc";

type Props = {
  children: React.ReactNode;
};

const SubscriptionProvider = ({ children }: Props) => {
  const init = useInitialRevenueCat();
  const router = useRouter();
  const { user } = FireAuthHooks.useGetUser();

  const Global = useGlobalStore();
  const Sources = useSourcesStore();

  const [isPremium, setIsPremium] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = useCallback(
    async (priceId?: string) => {
      setIsLoading(true);
      toast.loading("Redirecting to checkout...", { id: "checkout" });

      const checkout = await getCheckoutUrl(priceId);

      toast.dismiss("checkout");
      router.push(checkout);
    },
    [router]
  );

  const handleManageSubscription = useCallback(async () => {
    setIsLoading(true);
    toast.loading("Redirecting to subscriptions...", { id: "subscrptions" });

    const manage = await getPortalUrl();

    toast.dismiss("subscrptions");
    router.push(manage);
  }, [router]);

  /**
   * Listen to the user's subscription status
   * and make updates accordingly
   */
  useSubscriptionListener(
    `customers/${user.uid}/subscriptions`,
    (status) => {
      setIsPremium(status);
    },
    (error) => {
      captureException(error);
    },
    [where("status", "in", ["trialing", "active"])]
  );

  /**
   * Doc changes handlers
   */
  const handleDocChanges = useCallback(
    (docs: IClipmateBase[]) => {
      const Trashed = docs.filter((doc) => doc.inbox === "trash");
      const RemoveFromUnsorted = docs.filter(
        (doc) => !isEmpty(doc.collections) || doc.inbox === "trash"
      );
      const AddToUnsorted = docs.filter(
        (doc) => isEmpty(doc.collections) && doc.inbox !== "trash"
      );

      if (!isEmpty(RemoveFromUnsorted)) {
        Global.handleDeleteItemFromPair(
          "getAllClipmateUnsortedItems",
          RemoveFromUnsorted.map((item) => item._id)
        );

        Trashed.forEach((doc) => {
          Sources.handleDeleteItemFromPair(doc.type, [doc._id]);
        });
      }

      if (!isEmpty(AddToUnsorted)) {
        Global.handleRealtimeAddItemToPair("getAllClipmateItems", AddToUnsorted);
        Global.handleRealtimeAddItemToPair("getAllClipmateUnsortedItems", AddToUnsorted);

        AddToUnsorted.forEach((doc) => {
          Sources.handleRealtimeAddItemToPair(doc.type, [doc]);
        });
      }
    },
    [Global, Sources]
  );

  const handleDocRemoval = useCallback(
    (docs: IClipmateBase[]) => {
      Global.handleDeleteItemFromPair(
        "getAllClipmateItems",
        docs.map((item) => item._id)
      );
      Global.handleDeleteItemFromPair(
        "getAllClipmateUnsortedItems",
        docs.map((item) => item._id)
      );
      docs.forEach((doc) => {
        Sources.handleDeleteItemFromPair(doc.type, [doc._id]);
      });
    },
    [Global, Sources]
  );

  /**
   * Perform addition and removal of items and update the cache
   * For All Item, Unsorted Item and Source Item
   */

  useDBListener(
    `users/${user.uid}/bookmarks`,
    (docs) => null,
    (docs) => handleDocChanges(docs),
    (docs) => handleDocRemoval(docs)
  );

  const ContextValue = useMemo(
    () => ({ isPremium, isLoading, handleCheckout, handleManageSubscription }),
    [isPremium, isLoading, handleCheckout, handleManageSubscription]
  );

  return (
    <SubscriptionContext.Provider value={ContextValue}>{children}</SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
