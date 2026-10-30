"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Anchor } from "ui-lab-components/anchor";
import { Banner } from "ui-lab-components/banner";
import { Button } from "ui-lab-components/button";
import { Divider } from "ui-lab-components/divider";
import { Flex } from "ui-lab-components/flex";
import { Input } from "ui-lab-components/input";
import { Label } from "ui-lab-components/label";
import { GoogleIcon, navigateToApp, redirectTarget } from "./sign-in-form";

/**
 * Custom Clerk sign-up built on the signal-based `useSignUp()` (SignUpFuture)
 * API, mirroring SignInForm. Google SSO or email + password, then an emailed
 * code verifies the address. Field and global errors come straight from Clerk's
 * parsed `errors`, so this component holds no error state.
 */
export function SignUpForm() {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();
  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [unsupported, setUnsupported] = useState(false);
  const pending = fetchStatus === "fetching";
  // A Google sign-up handed back by the SSO callback that still needs fields this form doesn't collect.
  const incomplete = signUp.status === "missing_requirements" && signUp.missingFields.length > 0;

  async function finalize() {
    await signUp.finalize({ navigate: navigateToApp(router) });
  }

  async function continueWithGoogle() {
    setUnsupported(false);
    const callback = `/sso-callback?redirect_url=${encodeURIComponent(redirectTarget())}`;
    await signUp.sso({
      strategy: "oauth_google",
      redirectUrl: redirectTarget(),
      redirectCallbackUrl: callback,
    });
  }

  async function advance() {
    if (signUp.status === "complete") return finalize();
    if (signUp.unverifiedFields.includes("email_address") && signUp.missingFields.length === 0) {
      const { error } = await signUp.verifications.sendEmailCode();
      if (!error) setStep("code");
      return;
    }
    setUnsupported(true);
  }

  async function submitCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUnsupported(false);
    const data = new FormData(e.currentTarget);
    const { error } = await signUp.password({
      emailAddress: String(data.get("emailAddress")),
      password: String(data.get("password")),
    });
    if (!error) await advance();
  }

  async function submitCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code"));
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (!error && signUp.status === "complete") await finalize();
  }

  async function resendCode() {
    await signUp.verifications.sendEmailCode();
  }

  async function startOver() {
    setUnsupported(false);
    await signUp.reset();
    setStep("credentials");
  }

  const emailError = errors.fields.emailAddress?.message;
  const passwordError = errors.fields.password?.message;
  const codeError = errors.fields.code?.message;
  const globalError = errors.global?.[0]?.message;

  return (
    <Flex direction="column" gap={8} w="full" className="max-w-sm">
      <Flex direction="column" gap={2}>
        <h1 className="text-2xl font-medium text-foreground-50">
          {step === "credentials" ? "Create an account" : "Check your email"}
        </h1>
        <p className="text-foreground-400">
          {step === "credentials"
            ? "Create an account to unlock the Supporter package."
            : `Enter the code sent to ${signUp.emailAddress ?? "your email"}.`}
        </p>
      </Flex>

      <Divider variant="dashed" size="sm" />

      {(globalError || unsupported || incomplete) && (
        <Banner variant="danger" role="alert" aria-live="assertive">
          <Banner.Body>
            {globalError ??
              "This account needs details this form doesn't support yet."}
          </Banner.Body>
        </Banner>
      )}

      {step === "credentials" ? (
        <form onSubmit={submitCredentials} noValidate>
          <Flex direction="column" gap={6}>
            <div>
              <Label
                htmlFor="emailAddress"
                error={!!emailError}
                helperText={emailError && <span id="emailAddress-error">{emailError}</span>}
                helperTextError
              >
                Email address
              </Label>
              <Input
                id="emailAddress"
                name="emailAddress"
                type="email"
                autoComplete="email"
                required
                autoFocus
                disabled={pending}
                error={!!emailError}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "emailAddress-error" : undefined}
              />
            </div>
            <div>
              <Label
                htmlFor="password"
                error={!!passwordError}
                helperText={passwordError && <span id="password-error">{passwordError}</span>}
                helperTextError
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                disabled={pending}
                error={!!passwordError}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
            </div>
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Creating account…" : "Create account"}
            </Button>
            <p className="text-center text-foreground-400">or</p>
            <Button
              variant="secondary"
              icon={<GoogleIcon />}
              disabled={pending}
              onPress={continueWithGoogle}
            >
              Continue with Google
            </Button>
            {incomplete && (
              <Button variant="ghost" disabled={pending} onPress={startOver}>
                Start over
              </Button>
            )}
          </Flex>
        </form>
      ) : (
        <form onSubmit={submitCode} noValidate>
          <Flex direction="column" gap={6}>
            <div>
              <Label
                htmlFor="code"
                error={!!codeError}
                helperText={codeError && <span id="code-error">{codeError}</span>}
                helperTextError
              >
                Verification code
              </Label>
              <Input
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                autoFocus
                disabled={pending}
                error={!!codeError}
                aria-invalid={!!codeError}
                aria-describedby={codeError ? "code-error" : undefined}
              />
            </div>
            <Flex direction="column" gap={2}>
              <Button type="submit" variant="primary" disabled={pending}>
                {pending ? "Verifying…" : "Verify"}
              </Button>
              <Button variant="ghost" disabled={pending} onPress={resendCode}>
                Send a new code
              </Button>
              <Button variant="ghost" disabled={pending} onPress={startOver}>
                Use a different email
              </Button>
            </Flex>
          </Flex>
        </form>
      )}

      {step === "credentials" && (
        <p className="text-foreground-400">
          Already have an account?{" "}
          <Anchor href="/sign-in" target="_self">
            Sign in
          </Anchor>
        </p>
      )}

      {/* Clerk mounts its bot-protection challenge here when enabled. */}
      <div id="clerk-captcha" />
    </Flex>
  );
}
