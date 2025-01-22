"use client";

import { useEffect, useMemo } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { env } from "@/lib/env";

type Props = {
  children: React.ReactNode;
};
const ClipmatePostHogProvider = ({ children }: Props) => {
  useEffect(() => {
    posthog.init(env.posthog_id, {
      api_host: env.posthog_host,
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
      autocapture: false,
    });
  }, []);

  const memoizedProvider = useMemo(
    () => <PostHogProvider client={posthog}>{children}</PostHogProvider>,
    [children]
  );

  return memoizedProvider;
};

export default ClipmatePostHogProvider;
