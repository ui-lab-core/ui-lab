import { getGuideById, searchGuides } from "ui-lab-registry";
import type { GuideMetadata } from "ui-lab-registry";

function getGuide(id: string): GuideMetadata | null {
  try {
    return getGuideById(id) ?? null;
  } catch {
    return null;
  }
}

function search(query: string, limit = 5): GuideMetadata[] {
  try {
    return searchGuides(query).slice(0, limit);
  } catch {
    return [];
  }
}

export const guidesAdapter = { getGuide, search };
