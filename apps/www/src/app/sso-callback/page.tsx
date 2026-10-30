import type { Metadata } from "next";
import { SSOCallback } from "@/features/account/components/sso-callback";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";

export const metadata: Metadata = buildMetadata({
  pathname: "/sso-callback",
  title: "Signing in",
  description: "Completing sign-in to UI Lab.",
});

export default function SSOCallbackPage() {
  return (
    <div className="flex min-h-[70svh] w-full items-center justify-center px-4 py-16">
      <SSOCallback />
    </div>
  );
}
