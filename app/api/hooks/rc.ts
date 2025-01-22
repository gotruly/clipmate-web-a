/**
 * This hook is used for RevenueCat related operations
 * login, logout, purchase, fetching entitlements, etc.
 */
import { Package, Purchases } from "@revenuecat/purchases-js";
import FireAuthHooks from "./fireauth";
import { env } from "@/lib/env";
import { useMutation, useQuery } from "@tanstack/react-query";

const useInitialRevenueCat = () => {
  /**
   * Get the user from Firebase Auth
   */
  const { user } = FireAuthHooks.useGetUser();

  /**
   * Configure RevenueCat with the user's UID
   */
  if (user.uid) Purchases.configure(env.rc_key, user.uid);
};

const useRevenueCat = () => {
  /**
   * Get the user from Firebase Auth
   */
  const { user } = FireAuthHooks.useGetUser();

  /**
   * Get the customer info from RevenueCat
   */
  const useGetCustomer = () =>
    useQuery({
      queryKey: ["customer", user.uid],
      queryFn: async () => {
        return await Purchases.getSharedInstance().getCustomerInfo();
      },
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    });

  /**
   * Get the offerings from RevenueCat
   */
  const useGetOfferings = () =>
    useQuery({
      queryKey: ["offerings", user.uid],
      queryFn: async () => {
        return await Purchases.getSharedInstance().getOfferings();
      },
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    });

  /**
   * Handle the purchase of a package
   */
  const useHandlePurchase = () =>
    useMutation({
      mutationKey: ["purchase", user.uid],
      mutationFn: async (pckg: Package) => {
        return await Purchases.getSharedInstance().purchase({
          rcPackage: pckg,
          customerEmail: user.email?.toString(),
        });
      },
    });

  return { useGetCustomer, useGetOfferings, useHandlePurchase };
};

export default useInitialRevenueCat;
export { useRevenueCat };
