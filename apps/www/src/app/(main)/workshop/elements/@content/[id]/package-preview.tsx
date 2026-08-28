"use client";

import { getPackagePreviewComponent } from "@/features/workshop/lib/get-package-preview";

export default function PackagePreview({ packageId }: { packageId: string }) {
  const Preview = getPackagePreviewComponent(packageId);

  return Preview ? <Preview /> : <div className="text-foreground-400">Preview</div>;
}
