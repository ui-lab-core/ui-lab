import type { Metadata } from "next";
import { SignInForm } from "@/features/account/components/sign-in-form";
import { generateMetadata as buildMetadata } from "@/shared/lib/metadata";

export const metadata: Metadata = buildMetadata({
  pathname: "/sign-in",
  title: "Sign in",
  description: "Sign in to UI Lab to unlock the Supporter package.",
});

export default function SignInPage() {
  return (
    <div className="relative isolate flex min-h-svh w-full items-center justify-center px-4 py-16">
      <div
        aria-hidden
        className="grid-paper pointer-events-none absolute! inset-x-0 bottom-0 -z-10 h-1/2!"
        style={{ maskImage: "linear-gradient(to top, black, transparent)" }}
      />
      <SignInForm />
    </div>
  );
}
