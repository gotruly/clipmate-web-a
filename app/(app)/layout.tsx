"use client";

import queryClient from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { usePostHog } from "posthog-js/react";
import FireAuthHooks from "../api/hooks/fireauth";
import { usePathname, useRouter } from "next/navigation";
import Intercom from "@intercom/messenger-js-sdk";
import CryptoJS from "crypto-js";

import SideMenu from "./components/SideMenu";

// Providers
import CopyPasteProvider from "@/providers/CopyPasteProvider";
import CollectionProvider from "@/providers/CollectionsProvider";
import DragNDropFromOSContextProvider from "@/providers/DragNDropFromOSProvider";
import AccessControlProvider from "@/providers/AccessControlProvider";
import MultipleItemActionProvider from "@/providers/MultipleItemActionProvider";
import SubscriptionProvider from "@/providers/SubscriptionProvider";

import { useEffect } from "react";
import { ThemeProvider } from "next-themes";
import LoadingPage from "../loading";
import { env } from "@/lib/env";
import CommandKProvider from "@/providers/CommandKProvider";
import ClipmateToaster from "@/components/ClipmateToaster";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const path = usePathname();
  const posthog = usePostHog();
  const { user, isLoading } = FireAuthHooks.useGetUser();

  useEffect(() => {
    if (user) {
      const { email, displayName, uid, photoURL, isAnonymous, emailVerified, phoneNumber } = user;
      const info = { email, displayName, uid, photoURL, isAnonymous, emailVerified, phoneNumber };
      const UID_HMAC = CryptoJS.HmacSHA256(uid, env.intercom_HMAC).toString(CryptoJS.enc.Hex);

      // Posthog Page Capture
      posthog.capture("$pageview", {
        $current_url: window.origin + path,
        email: email,
        $creator_event_uuid: uid,
      });
      posthog.identify(uid, { info });

      // Intercom - Support Chat Init
      Intercom({
        app_id: env.intercom_id,
        user_id: uid,
        name: displayName?.toString(),
        email: email?.toString(),
        user_hash: UID_HMAC,
        created_at: Date.now(),
      });
    }
  }, [path, posthog, user]);

  if (isLoading) return <LoadingPage />;

  if (!isLoading && user === null) {
    router.push("/sign-in");
    return <LoadingPage />;
  }

  return (
    <ThemeProvider
      storageKey="clipmate"
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <SubscriptionProvider>
          <AccessControlProvider>
            <CopyPasteProvider>
              <DragNDropFromOSContextProvider>
                <CollectionProvider>
                  <MultipleItemActionProvider>
                    <CommandKProvider>
                      <main className="h-screen w-full flex items-start gap-0 whitespace-nowrap box-border overflow-x-hidden">
                        <div className="w-[280px] h-screen sticky top-0 py-2">
                          <SideMenu />
                        </div>

                        <div className="w-full box-border pr-2 py-2 flex-1">{children}</div>
                      </main>
                    </CommandKProvider>

                    <ClipmateToaster />
                  </MultipleItemActionProvider>
                </CollectionProvider>
              </DragNDropFromOSContextProvider>
            </CopyPasteProvider>
          </AccessControlProvider>
        </SubscriptionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default AppLayout;
