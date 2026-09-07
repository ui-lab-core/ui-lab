import { AccountNav } from "@/features/account/components/account-nav";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-(--page-width) pt-(--header-height)">
      <header className="pt-12 pb-8">
        <h1 className="text-2xl font-semibold text-foreground-50">Account</h1>
        <p className="mt-1 text-sm text-foreground-300">
          Your profile, what your account unlocks, and where to change it.
        </p>
      </header>

      <div className="flex flex-col gap-8 pb-16 md:flex-row md:gap-12">
        <AccountNav />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
