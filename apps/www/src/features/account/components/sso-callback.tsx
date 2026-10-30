"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn, useSignUp } from "@clerk/nextjs";
import { navigateToApp } from "./sign-in-form";

/**
 * Completes the Google redirect started by SignInForm, following Clerk's
 * custom-flow SSO callback: finalize a completed sign-in/sign-up, transfer
 * between the two when the account does or doesn't exist yet, and send anything
 * needing more input back to the sign-in or sign-up pages.
 */
export function SSOCallback() {
  const clerk = useClerk();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();
  const hasRun = useRef(false);

  useEffect(() => {
    (async () => {
      if (!clerk.loaded || hasRun.current) return;
      // Session activation re-renders the page; run the handoff once.
      hasRun.current = true;
      const navigate = navigateToApp(router);
      const toSignIn = () => router.push("/sign-in");

      if (signIn.status === "complete") return void (await signIn.finalize({ navigate }));

      // Signed up with an email that already has an account: continue as a sign-in.
      if (signUp.isTransferable) {
        await signIn.create({ transfer: true });
        const status = signIn.status as typeof signIn.status | "complete";
        if (status === "complete") return void (await signIn.finalize({ navigate }));
        return toSignIn();
      }

      if (
        signIn.status === "needs_first_factor" &&
        !signIn.supportedFirstFactors?.every((f) => f.strategy === "enterprise_sso")
      ) {
        return toSignIn();
      }

      // New Google account with no user yet: create it.
      if (signIn.isTransferable) {
        await signUp.create({ transfer: true });
        if (signUp.status === "complete") return void (await signUp.finalize({ navigate }));
        // SignUpForm picks up the in-progress sign-up and reports the missing requirements.
        return router.push("/sign-up");
      }

      if (signUp.status === "complete") return void (await signUp.finalize({ navigate }));

      if (signIn.status === "needs_second_factor" || signIn.status === "needs_new_password") {
        return toSignIn();
      }

      // The Google account is already signed in on this client: activate that session.
      const sessionId = signIn.existingSession?.sessionId || signUp.existingSession?.sessionId;
      if (sessionId) await clerk.setActive({ session: sessionId, navigate });
    })();
  }, [clerk, signIn, signUp, router]);

  return (
    <>
      <p className="text-foreground-400">Signing you in…</p>
      {/* A sign-in transferred to a sign-up may require captcha. */}
      <div id="clerk-captcha" />
    </>
  );
}
