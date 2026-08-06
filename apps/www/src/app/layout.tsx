import "./globals.css";
import "ui-lab-components/typography.css";

import { Metadata } from "next";

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
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
