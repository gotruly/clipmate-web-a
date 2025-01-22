// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import {
  init,
  replayIntegration,
  browserTracingIntegration,
  browserProfilingIntegration,
} from "@sentry/nextjs";

init({
  dsn: "https://5476dd28dd259e15d4ba0e6874173c8e@o4508138006446080.ingest.de.sentry.io/4508138046554193",

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/app\.clipmate\.ai\/.*/],

  // Set profilesSampleRate to 1.0 to profile every transaction.
  profilesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
    // Add browser profiling integration to the list of integrations
    browserTracingIntegration(),
    browserProfilingIntegration(),
  ],
});
