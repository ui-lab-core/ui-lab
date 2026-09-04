/**
 * Routes the pay gate points at. There is one paid plan — the Supporter
 * package, a one-time purchase — so every locked surface sends people to the
 * same place instead of to a per-item checkout.
 */
export const ROUTES = {
  /** The Supporter plan page, which owns checkout. */
  supporter: "/supporter",
  /** Where Stripe returns the buyer. Signed-in only; see `proxy.ts`. */
  supporterSuccess: "/supporter/success",
  /** The signed-in account dashboard. Protected in `proxy.ts`. */
  account: "/accounts",
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;

export const SUPPORTER_ROUTE = ROUTES.supporter;
export const SIGN_IN_ROUTE = ROUTES.signIn;
export const ACCOUNT_ROUTE = ROUTES.account;
