import { getAllGuides, getGuideById } from "ui-lab-registry";
import type { GuideMetadata } from "ui-lab-registry";
import { rank, relaxedRank, type Field } from "../search.js";

function getGuide(id: string): GuideMetadata | null {
  return getGuideById(id) ?? null;
}

function all(): GuideMetadata[] {
  return getAllGuides();
}

function fields(guide: GuideMetadata): Field[] {
  return [
    { value: guide.id, weight: 60, exactWeight: 140 },
    { value: guide.name, weight: 40, exactWeight: 100 },
    { value: guide.tags, weight: 20, exactWeight: 45 },
    { value: guide.taskMatchers, weight: 25 },
    { value: guide.whenToUse, weight: 15 },
    { value: guide.category, weight: 20 },
    { value: guide.summary, weight: 10 },
    { value: guide.description, weight: 8 },
  ];
}

function search(query: string, limit = 5): GuideMetadata[] {
  return rank(all(), fields, query, limit);
}

function suggest(query: string, limit = 5): GuideMetadata[] {
  return relaxedRank(all(), fields, query, limit);
}

export const guidesAdapter = { getGuide, all, search, suggest };
