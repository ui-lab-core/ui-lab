/**
 * Routes the pay gate points at. There is one paid plan — the Supporter
 * package, a one-time purchase — so every locked surface sends people to the
 * same place instead of to a per-item checkout.
 *
 * `supporter` and `signIn` are placeholders for routes that do not exist yet:
 * they are what the plan page and auth will own, so nothing that links here has
 * to be rewritten when they land.
 */
export const ROUTES = {
  /** The Supporter plan page, which owns checkout. */
  supporter: "/supporter",
  signIn: "/sign-in",
} as const;

export const SUPPORTER_ROUTE = ROUTES.supporter;
export const SIGN_IN_ROUTE = ROUTES.signIn;
