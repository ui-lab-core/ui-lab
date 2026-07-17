import "./globals.css";
import "lenis/dist/lenis.css";
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

// Karla is the body/header font and the LCP text element on most pages. It is
// self-hosted from a stable public URL (see the "KarlaLocal" @font-face in
// globals.css) and preloaded in <head> below so the browser fetches it in
// parallel with the document instead of after the CSS — this is what stops the
// heading's late font-swap from gating LCP. The @fontsource "Karla" import above
// is kept so the literal family stays available to the typography/theme tooling.
const KARLA_PRELOAD_HREF = "/assets/fonts/sans/karla-latin-wght-normal.woff2";

export const metadata: Metadata = generateMetadata();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href={KARLA_PRELOAD_HREF}
          crossOrigin="anonymous"
        />
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
