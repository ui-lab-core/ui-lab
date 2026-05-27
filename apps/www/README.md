This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Premium Entitlement Setup

For the local premium-content workflow, this app links `@ui-lab-core/library` to
`../../../private/packages/library` so workshop metadata edits are visible in
`/dev/private` without publishing the private package.

### 1. Initialize Convex

Run Convex from the monorepo root:

```bash
pnpm -C app --filter @ui-lab/site exec convex dev
```

This creates or connects the `apps/www/convex` deployment and writes the local
Next.js variables to `apps/www/.env.local`.

If you see `InvalidDeploymentName: Couldn't parse deployment name ...`, remove
placeholder values from `apps/www/.env.local`. In particular, do not leave these
as literal `...` values:

```txt
NEXT_PUBLIC_CONVEX_URL=...
CONVEX_DEPLOYMENT=...
```

After removing those placeholders, rerun `convex dev` and let the CLI write the
real values.

### 2. Local Next.js environment

Required in `apps/www/.env.local`:

```txt
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
CONVEX_DEPLOYMENT=dev:<deployment>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_FRONTEND_API_URL=https://<clerk-frontend-api>.clerk.accounts.dev
```

Billing checkout also needs a Stripe Price ID wherever the checkout UI passes
`priceId` to `api.billing.createSubscriptionCheckout`.

Where to get each value:

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_CONVEX_URL` | Convex Dashboard -> project -> deployment -> Settings -> URL & Deploy Key. Docs: https://docs.convex.dev/dashboard/deployments/deployment-settings |
| `CONVEX_DEPLOYMENT` | Usually written by `convex dev`. You can also inspect `apps/www/.env.local` after linking the project. Convex env docs: https://docs.convex.dev/production/environment-variables |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard -> app/environment -> API Keys. Use the test key locally, but the live key in production. Docs: https://clerk.com/docs/deployments/clerk-environment-variables |
| `CLERK_SECRET_KEY` | Clerk Dashboard -> app/environment -> API Keys. Use the test secret locally, but the live secret in production. Docs: https://clerk.com/docs/deployments/clerk-environment-variables |
| `CLERK_FRONTEND_API_URL` | Clerk Dashboard -> app/environment -> JWT Templates -> Convex template / issuer URL, also called the Frontend API URL. Use the production issuer in deployed environments, not a `*.clerk.accounts.dev` URL. Convex + Clerk guide: https://clerk.com/docs/integrations/databases/convex |
| Stripe Price ID | Stripe Dashboard -> Product catalog -> product -> pricing row, or direct test-mode prices: https://dashboard.stripe.com/test/prices |

### 3. Convex deployment environment

These secrets must be set on the Convex deployment, not only in `.env.local`,
because Convex functions and HTTP webhooks read them server-side:

```bash
pnpm -C app --filter @ui-lab/site exec convex env set CLERK_FRONTEND_API_URL https://...
pnpm -C app --filter @ui-lab/site exec convex env set STRIPE_SECRET_KEY sk_test_...
pnpm -C app --filter @ui-lab/site exec convex env set STRIPE_WEBHOOK_SECRET whsec_...
```

Where to get each Convex env value:

| Variable | Where to get it |
| --- | --- |
| `CLERK_FRONTEND_API_URL` | Same Clerk issuer/frontend API URL used in `.env.local`: https://clerk.com/docs/integrations/databases/convex |
| `STRIPE_SECRET_KEY` | Stripe Dashboard -> Developers -> API keys. Docs: https://docs.stripe.com/keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard -> Developers -> Webhooks -> select endpoint -> Signing secret. Docs: https://docs.stripe.com/webhooks |

Convex environment variables can also be edited in the Convex Dashboard:
https://dashboard.convex.dev

### 4. Clerk JWT template

Create a Clerk JWT template named `convex` using Clerk's Convex integration
guide: https://clerk.com/docs/integrations/databases/convex

The template name matters because server entitlement checks call:

```ts
getToken({ template: "convex" })
```

### 5. Stripe webhook endpoint

The Convex HTTP route is registered at:

```txt
https://<deployment>.convex.site/stripe/webhook
```

Create this endpoint in Stripe test mode at
https://dashboard.stripe.com/test/webhooks and subscribe to:

```txt
checkout.session.completed
customer.created
customer.updated
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.created
invoice.finalized
invoice.paid
invoice.payment_failed
payment_intent.succeeded
payment_intent.payment_failed
```

The `@convex-dev/stripe` component stores Stripe records in its component
tables. The app also mirrors the current user's billing state into
`accounts.premium`, `accounts.stripeCustomerId`,
`accounts.stripeSubscriptionId`, `accounts.stripePriceId`,
`accounts.subscriptionStatus`, `accounts.subscriptionCurrentPeriodEnd`,
`accounts.subscriptionCancelAtPeriodEnd`, and `accounts.subscriptionCancelAt`
from signed Stripe webhooks.

Stripe variables are only needed for billing work. The local acceptance test can
still use the Convex dashboard to edit `accounts.premium` manually.

### 6. Vercel production variables

Set the public/server Next.js variables in Vercel Project Settings ->
Environment Variables: https://vercel.com/docs/projects/environment-variables

For Clerk, make sure the production deployment uses live values:

```txt
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
CLERK_FRONTEND_API_URL=https://<production-issuer>
```

Set the Convex deployment secrets separately in Convex, since Vercel variables
are not automatically available to Convex functions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
