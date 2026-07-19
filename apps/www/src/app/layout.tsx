import "./globals.css";
// The showcase indexes every preview, so load the aggregate once and suppress
// its otherwise-duplicate automatic package sidecars in next.config.
import "ui-lab-components/styles.css";
import "ui-lab-components/typography.css";

import { Metadata } from "next";

import { AuthProviders } from "./auth-providers";
import { RootLayoutClient } from "./client";
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
    <html data-font="work-sans" lang="en" suppressHydrationWarning>
      <head>
        <script
          id="site-theme-script"
          dangerouslySetInnerHTML={{ __html: getInitialThemeScript() }}
          suppressHydrationWarning
        />
        <script
          id="site-scroll-restore-script"
          dangerouslySetInnerHTML={{ __html: generateScrollRestoreScript() }}
          suppressHydrationWarning
        />
      </head>
      <body className="antialiased">
        <AuthProviders>
          <RootLayoutClient>{children}</RootLayoutClient>
        </AuthProviders>
      </body>
    </html>
  );
}
