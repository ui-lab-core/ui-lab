export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-(--page-width) flex-col md:flex-row">
      <div className="mt-(--header-height) flex flex-1 flex-col">
        <div className="flex items-start">
          <div className="mx-auto w-full max-w-5xl px-6 pb-12">{children}</div>
        </div>
      </div>
    </div>
  );
}
