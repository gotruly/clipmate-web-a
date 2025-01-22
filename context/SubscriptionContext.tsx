import { createContext } from "react";

type SubscriptionContextType = {
  isPremium: boolean;
  isLoading: boolean;
  handleCheckout: (priceId?: string) => void;
  handleManageSubscription: () => void;
};

const SubscriptionContext = createContext<SubscriptionContextType>({} as SubscriptionContextType);

export type { SubscriptionContextType };
export default SubscriptionContext;
