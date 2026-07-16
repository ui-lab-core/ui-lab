"use client";

import React from "react";
import {
  getElementPreview,
  getElementPreviewConfig,
  listElements as listPrivateElements,
  type ElementSourceEntry,
} from "@ui-lab-core/library";
import { buttonDetail } from "ui-lab-registry/components/Button";
import { dateDetail } from "ui-lab-registry/components/Date";
import { anchorDetail } from "ui-lab-registry/components/Anchor";
import { bannerDetail } from "ui-lab-registry/components/Banner";
import { badgeDetail } from "ui-lab-registry/components/Badge";
import { pathDetail } from "ui-lab-registry/components/Path";
import { cardDetail } from "ui-lab-registry/components/Card";
import { checkboxDetail } from "ui-lab-registry/components/Checkbox";
import { colorDetail } from "ui-lab-registry/components/Color";
import { dividerDetail } from "ui-lab-registry/components/Divider";
import { flexDetail } from "ui-lab-registry/components/Flex";
import { expandDetail } from "ui-lab-registry/components/Expand";
import { galleryDetail } from "ui-lab-registry/components/Gallery";
import { gridDetail } from "ui-lab-registry/components/Grid";
import { groupDetail } from "ui-lab-registry/components/Group";
import { inputDetail } from "ui-lab-registry/components/Input";
import { labelDetail } from "ui-lab-registry/components/Label";
import { menuDetail } from "ui-lab-registry/components/Menu";
import { toastDetail } from "ui-lab-registry/components/Toast";
import { modalDetail } from "ui-lab-registry/components/Modal";
import { pageDetail } from "ui-lab-registry/components/Page";
import { maskDetail } from "ui-lab-registry/components/Mask";
import { popoverDetail } from "ui-lab-registry/components/Popover";
import { confirmDetail } from "ui-lab-registry/components/Confirm";
import { progressDetail } from "ui-lab-registry/components/Progress";
import { radioDetail } from "ui-lab-registry/components/Radio";
import { commandDetail } from "ui-lab-registry/components/Command";
import { scrollDetail } from "ui-lab-registry/components/Scroll";
import { skeletonDetail } from "ui-lab-registry/components/Skeleton";
import { selectDetail } from "ui-lab-registry/components/Select";
import { sliderDetail } from "ui-lab-registry/components/Slider";
import { switchDetail } from "ui-lab-registry/components/Switch";
import { tableDetail } from "ui-lab-registry/components/Table";
import { codeDetail } from "ui-lab-registry/components/Code";
import { tabsDetail } from "ui-lab-registry/components/Tabs";
import { textareaDetail } from "ui-lab-registry/components/Textarea";
import { tooltipDetail } from "ui-lab-registry/components/Tooltip";
import { listDetail } from "ui-lab-registry/components/List";
import { panelDetail } from "ui-lab-registry/components/Panel";
import { frameDetail } from "ui-lab-registry/components/Frame";

import { ComponentDetail } from "@/types/component";
import { previews } from "@/gallery";
import {
  categoryMap as registryCategoryMap,
  componentRegistry as registryData,
  type ComponentCategory,
  type ComponentMetadata as RegistryMetadata,
  getComponentsInOrder,
  getCategoriesInOrder as getRegistryCategoriesInOrder,
  getCategoryIcon as getRegistryCategoryIcon,
} from "ui-lab-registry";
import {
  siteOnlyComingSoonCategories,
  type SiteComponentCategory,
  type SiteComponentCategoryDefinition,
} from "./coming-soon";

export type { SiteComponentCategory };

interface ComponentMetadata extends RegistryMetadata {
  preview: React.ReactNode;
  experimental?: boolean;
}

export const categoryMap = {
  ...registryCategoryMap,
  ...siteOnlyComingSoonCategories,
} as Record<SiteComponentCategory, SiteComponentCategoryDefinition>;

export const getCategoriesInOrder = (): SiteComponentCategory[] => [
  ...getRegistryCategoriesInOrder(),
  ...Object.keys(siteOnlyComingSoonCategories),
] as SiteComponentCategory[];

export const getCategoryIcon = (category: SiteComponentCategory): React.ReactNode => {
  if (category in siteOnlyComingSoonCategories) return null;
  return getRegistryCategoryIcon(category as ComponentCategory);
};

export const componentRegistry: ComponentMetadata[] = Object.entries(registryData).map(
  ([id, metadata]) => ({
    ...metadata,
    preview: previews[id] || <div />,
  }),
);

const getComponentsByCategory =
  (category: SiteComponentCategory): ComponentMetadata[] =>
    componentRegistry.filter((c) => c.category === category);

export const getComponentsGroupedByCategory =
  (): Record<SiteComponentCategory, ComponentMetadata[]> => {
    const result: Record<SiteComponentCategory, ComponentMetadata[]> = {} as Record<
      SiteComponentCategory,
      ComponentMetadata[]
    >;
    getCategoriesInOrder().forEach((catId) => {
      result[catId] = getComponentsByCategory(catId);
    });
    return result;
  };

export const getRelatedComponents = (id: string): ComponentMetadata[] => {
  const component = componentRegistry.find((c) => c.id === id);
  if (!component) return [];
  return component.relatedComponents
    .map((id) => componentRegistry.find((c) => c.id === id))
    .filter(Boolean) as ComponentMetadata[];
};

export const getComponentsInCategoryOrder =
  (category: SiteComponentCategory): ComponentMetadata[] => {
    const componentIds = getComponentsInOrder(category as ComponentCategory);
    return componentIds
      .map((id: string) =>
        componentRegistry.find((c): c is ComponentMetadata => c.id === id),
      )
      .filter((c): c is ComponentMetadata => c !== undefined);
  };

const componentDetails: Record<string, ComponentDetail> = {
  button: buttonDetail,
  date: dateDetail,
  color: colorDetail,
  anchor: anchorDetail,
  group: groupDetail,
  flex: flexDetail,
  grid: gridDetail,
  table: tableDetail,
  input: inputDetail,
  textarea: textareaDetail,
  label: labelDetail,
  select: selectDetail,
  checkbox: checkboxDetail,
  radio: radioDetail,
  banner: bannerDetail,
  badge: badgeDetail,
  path: pathDetail,
  tooltip: tooltipDetail,
  popover: popoverDetail,
  toast: toastDetail,
  modal: modalDetail,
  page: pageDetail,
  mask: maskDetail,
  slider: sliderDetail,
  progress: progressDetail,
  tabs: tabsDetail,
  menu: menuDetail,
  switch: switchDetail,
  card: cardDetail,
  command: commandDetail,
  confirm: confirmDetail,
  divider: dividerDetail,
  expand: expandDetail,
  gallery: galleryDetail,
  frame: frameDetail,
  scroll: scrollDetail,
  skeleton: skeletonDetail,
  list: listDetail,
  panel: panelDetail,
  code: codeDetail,
};

function isPublicFreeComponentExample(entry: ElementSourceEntry, componentId: string) {
  return (
    entry.package === "components" &&
    entry.previewEligible &&
    entry.groupPath[0] === componentId &&
    entry.visibility === "public" &&
    entry.access === "free"
  );
}

function isInteractiveExample(id: string) {
  return id.endsWith("-interactive");
}

function getPrivateComponentExamples(componentId: string): ComponentDetail["examples"] {
  return listPrivateElements("components")
    .filter((entry) => isPublicFreeComponentExample(entry, componentId))
    .sort((a, b) => {
      const aOrder = getElementOrder(a);
      const bOrder = getElementOrder(b);

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return a.id.localeCompare(b.id, undefined, { numeric: true });
    })
    .flatMap((entry) => {
      const Preview = getElementPreview(entry.package, entry.id);

      if (!Preview) {
        return [];
      }

      const previewConfig = getElementPreviewConfig(entry.package, entry.id);

      return [{
        id: entry.id,
        title: entry.displayName,
        description: entry.description,
        code: entry.code,
        preview: React.createElement(Preview),
        controls: previewConfig?.controls,
        factory: previewConfig?.factory,
        renderPreview: previewConfig?.renderPreview,
        previewLayout: previewConfig?.previewLayout,
        resizable: previewConfig?.resizable,
      }];
    });
}

function getElementOrder(entry: ElementSourceEntry) {
  const { order } = entry as ElementSourceEntry & { order?: unknown };
  return typeof order === "number" ? order : Number.POSITIVE_INFINITY;
}

function withPrivateComponentExamples(detail: ComponentDetail): ComponentDetail {
  const privateExamples = getPrivateComponentExamples(detail.id);

  if (privateExamples.length === 0) {
    return detail;
  }

  const privateExampleIds = new Set(privateExamples.map((example) => example.id));
  const staticHero = detail.examples.find((example) => example.id === "preview");
  const heroEasingControl = staticHero?.controls?.find(
    (control) => control.name === "easing",
  );

  const interactiveExamples = privateExamples
    .filter((example) => isInteractiveExample(example.id))
    .map((example) =>
      heroEasingControl &&
      !example.controls?.some((control) => control.name === "easing")
        ? { ...example, controls: [...(example.controls ?? []), heroEasingControl] }
        : example,
    );
  const otherExamples = privateExamples.filter(
    (example) => !isInteractiveExample(example.id),
  );

  return {
    ...detail,
    examples: [
      ...interactiveExamples,
      ...detail.examples.filter(
        (example) =>
          !privateExampleIds.has(example.id) &&
          !(interactiveExamples.length > 0 && example.id === "preview"),
      ),
      ...otherExamples,
    ],
  };
}

const componentDetailsWithPrivateExamples = Object.fromEntries(
  Object.entries(componentDetails).map(([id, detail]) => [
    id,
    withPrivateComponentExamples(detail),
  ]),
) as Record<string, ComponentDetail>;

export const getComponentById = (id: string): ComponentDetail | undefined =>
  componentDetailsWithPrivateExamples[id];

export const getComponentMetadata = (id: string): ComponentMetadata | undefined =>
  componentRegistry.find((component) => component.id === id);
