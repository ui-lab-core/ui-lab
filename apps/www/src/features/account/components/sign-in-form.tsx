"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Anchor } from "ui-lab-components/anchor";
import { Banner } from "ui-lab-components/banner";
import { Button } from "ui-lab-components/button";
import { Divider } from "ui-lab-components/divider";
import { Flex } from "ui-lab-components/flex";
import { Input } from "ui-lab-components/input";
import { Label } from "ui-lab-components/label";
import { Logo } from "@/features/layout/components/logo";

/**
 * Custom Clerk sign-in built on the signal-based `useSignIn()` (SignInFuture)
 * API. Google SSO or email + password; when Clerk asks for a second factor or client
 * trust, an emailed code finishes the attempt. Field and global errors come
 * straight from Clerk's parsed `errors`, so this component holds no error state.
 */

/** Google's "G" mark; brand colours are fixed by Google's guidelines, not theme tokens. */
export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.76c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.11V7.05H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.95l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

export function redirectTarget() {
  return new URLSearchParams(window.location.search).get("redirect_url") ?? "/";
}

/** Shared by finalize() here and the SSO callback route. */
export function navigateToApp(
  router: ReturnType<typeof useRouter>,
): NonNullable<Parameters<ReturnType<typeof useSignIn>["signIn"]["finalize"]>[0]>["navigate"] {
  return async ({ session, decorateUrl }) => {
    if (session?.currentTask) return;
    const url = decorateUrl(redirectTarget());
    if (url.startsWith("http")) window.location.href = url;
    else router.push(url);
  };
}

export function SignInForm() {
  const router = useRouter();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [step, setStep] = useState<"credentials" | "code">("credentials");
  const [unsupported, setUnsupported] = useState(false);
  const pending = fetchStatus === "fetching";

  async function finalize() {
    await signIn.finalize({ navigate: navigateToApp(router) });
  }

  async function continueWithGoogle() {
    setUnsupported(false);
    const callback = `/sso-callback?redirect_url=${encodeURIComponent(redirectTarget())}`;
    await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: redirectTarget(),
      redirectCallbackUrl: callback,
    });
  }

  async function advance() {
    if (signIn.status === "complete") return finalize();
    const needsCode =
      signIn.status === "needs_client_trust" ||
      (signIn.status === "needs_second_factor" &&
        signIn.supportedSecondFactors.some((f) => f.strategy === "email_code"));
    if (needsCode) {
      const { error } = await signIn.mfa.sendEmailCode();
      if (!error) setStep("code");
      return;
    }
    setUnsupported(true);
  }

  async function submitCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUnsupported(false);
    const data = new FormData(e.currentTarget);
    const { error } = await signIn.password({
      identifier: String(data.get("identifier")),
      password: String(data.get("password")),
    });
    if (!error) await advance();
  }

  async function submitCode(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const code = String(new FormData(e.currentTarget).get("code"));
    const { error } = await signIn.mfa.verifyEmailCode({ code });
    if (!error && signIn.status === "complete") await finalize();
  }

  async function startOver() {
    await signIn.reset();
    setStep("credentials");
  }

  const identifierError = errors.fields.identifier?.message;
  const passwordError = errors.fields.password?.message;
  const codeError = errors.fields.code?.message;
  const globalError = errors.global?.[0]?.message;

  return (
    <Flex
      direction="column"
      gap={6}
      w="full"
      className="max-w-sm rounded-xl border border-background-700 bg-background-950 p-7"
    >
      <Flex direction="column" gap={2}>
        <Logo className="text-foreground-50" />
        <h1 className="text-xl font-medium text-foreground-50">
          {step === "credentials" ? "Sign in" : "Check your email"}
        </h1>
        <p className="text-foreground-400">
          {step === "credentials"
            ? "Sign in to unlock the Supporter package."
            : `Enter the code sent to ${signIn.identifier ?? "your email"}.`}
        </p>
      </Flex>

      {(globalError || unsupported) && (
        <Banner variant="danger" role="alert" aria-live="assertive">
          <Banner.Body>
            {globalError ??
              "This account needs a verification method this form doesn't support yet."}
          </Banner.Body>
        </Banner>
      )}

      {step === "credentials" ? (
        <form onSubmit={submitCredentials} noValidate>
          <Flex direction="column" gap={6}>
            <Button
              variant="secondary"
              icon={<GoogleIcon />}
              disabled={pending}
              onPress={continueWithGoogle}
            >
              Continue with Google
            </Button>
            <Flex align="center" gap={3}>
              <Divider className="flex-1" />
              <span className="text-sm text-foreground-400">or</span>
              <Divider className="flex-1" />
            </Flex>
            <div>
              <Label
                htmlFor="identifier"
                error={!!identifierError}
                helperText={identifierError && <span id="identifier-error">{identifierError}</span>}
                helperTextError
              >
                Email address
              </Label>
              <Input
                id="identifier"
                name="identifier"
                type="email"
                autoComplete="email"
                required
                disabled={pending}
                error={!!identifierError}
                aria-invalid={!!identifierError}
                aria-describedby={identifierError ? "identifier-error" : undefined}
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
                autoComplete="current-password"
                required
                disabled={pending}
                error={!!passwordError}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "password-error" : undefined}
              />
            </div>
            <Button type="submit" variant="primary" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
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
              <Button variant="ghost" disabled={pending} onPress={startOver}>
                Use a different account
              </Button>
            </Flex>
          </Flex>
        </form>
      )}

      {step === "credentials" && (
        <p className="text-foreground-400">
          No account yet?{" "}
          <Anchor href="/sign-up" target="_self">
            Create one
          </Anchor>
        </p>
      )}
    </Flex>
  );
}
