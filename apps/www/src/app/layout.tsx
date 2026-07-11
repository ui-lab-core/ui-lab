import "./globals.css";

import "@fontsource/geist-sans";
import "@fontsource/geist-mono";
import "@fontsource-variable/karla";
import "@fontsource-variable/geist";
import "@fontsource-variable/inter";
import "@fontsource-variable/nunito-sans";
import "@fontsource-variable/roboto";
import "@fontsource-variable/work-sans";
import "@fontsource-variable/readex-pro";
import "@fontsource-variable/jetbrains-mono";
import localFont from "next/font/local";
import { Metadata } from "next";

import { AuthProviders } from "./auth-providers";
import { RootLayoutClient } from "./client";
import { featureFlags } from "@/shared/config/feature-flags";
import { generateMetadata } from "@/shared/lib/metadata";
import { getInitialThemeScript } from "@/features/theme/lib/initial-theme-script";
import { generateScrollRestoreScript } from "ui-lab-components/scripts";

const ioskeleyMono = localFont({
  src: [
    {
      path: "../../public/assets/fonts/monospace/IoskeleyMono-Medium.subset.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/assets/fonts/monospace/IoskeleyMono-MediumItalic.subset.woff2",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-ioskeley-mono",
  display: "swap",
  // Mono is used for code, not the above-the-fold heading (Karla). Skipping
  // preload keeps it off the LCP critical path; it loads on demand with swap.
  preload: false,
});

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
    <html lang="en" suppressHydrationWarning className={featureFlags.heavyFonts ? ioskeleyMono.variable : undefined}>
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
