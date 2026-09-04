import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";

export const metadata: Metadata = buildMetadata({
  pathname: "/sign-in",
  title: "Sign in",
  description: "Sign in to UI Lab to unlock the Supporter package.",
});

/**
 * Clerk's <SignIn /> calls usePathname internally, which cannot resolve during
 * prerendering. The widget is the entire page, so there is no meaningful shell
 * to stream around it — a Suspense fallback only buys a flash of placeholder.
 * Opt the segment out of instant validation and let it block instead.
 */
export const instant = false;

export default function SignInPage() {
  return (
    <div className="flex min-h-[70svh] w-full items-center justify-center px-4 py-16">
      <SignIn />
    </div>
  );
}
