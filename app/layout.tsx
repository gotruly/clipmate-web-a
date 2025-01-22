import type { Metadata } from "next";
import { IBM_Plex_Serif, Inter } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";
import { Monitoring } from "react-scan/monitoring/next";
import { env } from "@/lib/env";

const inter = Inter({ subsets: ["latin"] });
const ibm_plex_serif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Clipmate AI - The 2nd brain you know you need",
  description: "One App for Saving, Searching, and Organizing your Bookmarks",
};

const ClipmatePostHogProvider = dynamic(() => import("@/providers/PostHogProvider"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }} suppressHydrationWarning>
      <meta name="robots" content="noindex, nofollow" />
      <body className={`${inter.className} ${ibm_plex_serif.variable}`} suppressHydrationWarning>
        <Monitoring
          apiKey={env.react_scan_monitoring_api_key}
          url="https://monitoring.react-scan.com/api/v1/ingest"
          commit={process.env.COMMIT_HASH}
          branch={process.env.BRANCH}
        />
        <ClipmatePostHogProvider>
          <>{children}</>
        </ClipmatePostHogProvider>
      </body>
    </html>
  );
}
