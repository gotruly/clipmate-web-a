import { withSentryConfig } from "@sentry/nextjs";
import ReactComponentName from "react-scan/react-component-name/webpack";
import dotenv from "dotenv";

/** @type {import('next').NextConfig} */

dotenv.config();

const nextConfig = {
  // Setting up profiling
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Document-Policy",
            value: "js-profiling",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  skipTrailingSlashRedirect: true, // This is required to support PostHog trailing slash API requests
  env: {
    APP_NAME: process.env.APP_NAME,
    // Firebase ENV
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    // OAuth ENV
    REDDIT_CLIENT_ID: process.env.REDDIT_CLIENT_ID,
    TWITTER_CLIENT_ID: process.env.TWITTER_CLIENT_ID,
    TWITTER_REDIRECT_URI: process.env.TWITTER_REDIRECT_URI,
    REDDIT_REDIRECT_URI: process.env.REDDIT_REDIRECT_URI,
  },
  images: {
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 86400000 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.twimg.com",
      },
      {
        protocol: "https",
        hostname: "**.redd.it",
      },
      {
        protocol: "https",
        hostname: "**.redditmedia.com",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "**.ytimg.com", // Add this line to include i.ytimg.com
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // Allow Github Images
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 43200000,
      static: 43200000,
    },
  },
  webpack: (config) => {
    config.plugins.push(ReactComponentName({}));
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "clipmate-ai",
  project: "clipmate-web",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: false,

  // Uncomment to route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  // tunnelRoute: "/monitoring",

  // Custom Comment: We are not uploading source-maps until we figure out have to work with
  // environment variable on Firebase Hosting
  sourcemaps: {
    disable: true,
  },

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: false,
});
