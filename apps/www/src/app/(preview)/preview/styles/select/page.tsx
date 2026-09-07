import { Suspense } from "react";
import { generatedStyles } from "ui-lab-registry";
import { compilePreviewCss, readPreviewElement, readThemeScopes } from "@/features/docs/lib/style-preview-source";
import { SelectStyleFixture } from "@/features/docs/components/select-style-fixture";

type SelectStylePreviewProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default function SelectStylePreview(props: SelectStylePreviewProps) {
  return (
    <Suspense fallback={<p role="status" className="p-6 text-sm text-foreground-400">Loading preview…</p>}>
      <SelectStylePreviewContent {...props} />
    </Suspense>
  );
}

async function SelectStylePreviewContent({ searchParams }: SelectStylePreviewProps) {
  const params = await searchParams;
  const styles = generatedStyles.select;
  const kind = params.kind;
  const group = styles.styleableGroups.find((entry) => entry.name === params.group);
  const index = Number(params.index ?? 0);
  const code = kind === "recipe"
    ? styles.documentation?.quickStart?.recipes[index]?.code
    : kind === "customization" ? styles.documentation?.customization?.groups[index]?.code : undefined;
  try {
    const element = code?.trim().startsWith("<") ? readPreviewElement(code) : undefined;
    const css = code && !element ? await compilePreviewCss(code) : undefined;
    return <SelectStyleFixture group={group} groups={kind === "anatomy" ? styles.styleableGroups : undefined} themeCss={styles.onyxThemeCss ?? ""} themeScopes={readThemeScopes(styles.onyxThemeCss ?? "")} element={element} css={css} />;
  } catch {
    return <p className="p-6 text-sm text-foreground-400">This example needs a preview adapter.</p>;
  }
}
