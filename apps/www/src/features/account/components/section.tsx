import { Divider } from "ui-lab-components/divider";

export function Section({
  id,
  title,
  tone = "default",
  children,
}: {
  id: string;
  title: string;
  tone?: "default" | "danger";
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mb-12">
      <h2
        id={id}
        className={
          tone === "danger"
            ? "text-header-sm font-semibold text-danger-400"
            : "text-header-sm font-semibold text-foreground-200"
        }
      >
        {title}
      </h2>
      <Divider variant="dashed" spacing="lg" />
      {children}
    </section>
  );
}
