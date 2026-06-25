"use client";

import { useTypographyPlayground } from "../context";
import { PreviewSurface } from "./shared";

export function BodyPreviewContent() {
  const headingStyle = { fontFamily: "var(--font-header)" };

  return (
    <div className="space-y-4">
      <div className="h-70">
        <h1 className="text-header-xl font-bold text-foreground-50" style={headingStyle}>Heading 1 - The quick brown fox</h1>
        <h2 className="text-header-xl font-bold text-foreground-50" style={headingStyle}>Heading 2 - jumps over the lazy</h2>
        <h3 className="text-header-lg font-bold text-foreground-50" style={headingStyle}>Heading 3 - dog near the riverbank</h3>
        <h4 className="text-header-md font-bold text-foreground-50" style={headingStyle}>Heading 4 - Pack my box with five</h4>
        <h5 className="text-header-md font-bold text-foreground-50" style={headingStyle}>Heading 5 - dozen liquor jugs</h5>
        <h6 className="text-header-sm font-bold text-foreground-50" style={headingStyle}>Heading 6 - How vexingly quick</h6>
      </div>
      <p className="text-foreground-100">
        Body text. The five boxing wizards jump quickly. Sphinx of black quartz, judge my vow.
        How vexingly quick daft zebras jump! The job requires extra pluck and zeal from every
        young wage earner.
      </p>
      <p className="text-sm text-foreground-200">
        Small text - 0123456789 !@#$%^&*() - captions, helper text, and secondary information.
      </p>
    </div>
  );
}

export function BodyPreviewLab() {
  const {
    activeBodyPreviewStyle,
    selectedBodyFont,
    selectedHeaderFont,
  } = useTypographyPlayground();

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium text-foreground-400">
          Body - {selectedBodyFont}
        </div>
        <p className="mt-1 text-sm text-foreground-500">
          Type specimen uses {selectedHeaderFont} for headings.
        </p>
      </div>

      <PreviewSurface activeStyle={activeBodyPreviewStyle}>
        <BodyPreviewContent />
      </PreviewSurface>
    </div>
  );
}
