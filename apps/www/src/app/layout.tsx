import "@styles/globals.css";
import "ui-lab-components/typography.css";

import { Metadata } from "next";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";

import { RootLayoutClient } from "./client";
import { ConvexClientProvider } from "./providers/convex-client-provider";
import { generateMetadata } from "@/shared/lib/metadata";
import { getInitialThemeScript } from "@/features/theme/lib/initial-theme-script";
import { generateScrollRestoreScript } from "ui-lab-components/scripts";

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="site-theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: getInitialThemeScript() }}
        />
        <Script
          id="site-scroll-restore-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: generateScrollRestoreScript() }}
        />
      </head>
      <body className="antialiased">
        {/* Convex reads Clerk's context, so ClerkProvider must wrap it. Both sit
            inside <body> per Clerk's Next.js guidance. */}
        <ClerkProvider>
          <ConvexClientProvider>
            <RootLayoutClient>{children}</RootLayoutClient>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
