import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";

export const metadata: Metadata = buildMetadata({
  pathname: "/sign-up",
  title: "Create an account",
  description: "Create a UI Lab account to unlock the Supporter package.",
});

/**
 * Clerk's <SignUp /> calls usePathname internally, which cannot resolve during
 * prerendering. The widget is the entire page, so there is no meaningful shell
 * to stream around it — a Suspense fallback only buys a flash of placeholder.
 * Opt the segment out of instant validation and let it block instead.
 */
export const instant = false;

export default function SignUpPage() {
  return (
    <div className="flex min-h-[70svh] w-full items-center justify-center px-4 py-16">
      <SignUp />
    </div>
  );
}
