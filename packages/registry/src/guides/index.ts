import type { GuideMetadata, GuideRegistry } from '../types.js';
import setupUiLabInProjectGuide from './setup-ui-lab-in-project.js';
import themeSwitchingNextJsGuide from './theme-switching-nextjs.js';
import translateExistingUiToUiLabGuide from './translate-existing-ui-to-ui-lab.js';

export const guideRegistry: GuideRegistry = {
  [setupUiLabInProjectGuide.id]: setupUiLabInProjectGuide,
  [themeSwitchingNextJsGuide.id]: themeSwitchingNextJsGuide,
  [translateExistingUiToUiLabGuide.id]: translateExistingUiToUiLabGuide,
};

export function getGuideById(id: string): GuideMetadata | undefined {
  return guideRegistry[id.toLowerCase()];
}

export function getAllGuides(): GuideMetadata[] {
  return Object.values(guideRegistry);
}

export function getGuidesByCategory(category: string): GuideMetadata[] {
  return Object.values(guideRegistry).filter((guide) => guide.category === category);
}

export function getGuidesByTag(tag: string): GuideMetadata[] {
  const lowerTag = tag.toLowerCase();
  return Object.values(guideRegistry).filter((guide) =>
    guide.tags.some((value) => value.toLowerCase().includes(lowerTag))
  );
}

function scoreGuide(guide: GuideMetadata, query: string): number {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);

  if (terms.length === 0) {
    return 1;
  }

  const haystacks = {
    id: guide.id.toLowerCase(),
    name: guide.name.toLowerCase(),
    description: guide.description.toLowerCase(),
    summary: guide.summary.toLowerCase(),
    tags: guide.tags.map((tag) => tag.toLowerCase()),
    whenToUse: guide.whenToUse.map((item) => item.toLowerCase()),
    taskMatchers: guide.taskMatchers.map((item) => item.toLowerCase()),
  };

  let score = 0;

  for (const term of terms) {
    if (haystacks.id === term) score += 120;
    else if (haystacks.id.includes(term)) score += 80;

    if (haystacks.name.includes(term)) score += 60;
    if (haystacks.tags.some((tag) => tag === term)) score += 50;
    if (haystacks.tags.some((tag) => tag.includes(term))) score += 30;
    if (haystacks.taskMatchers.some((item) => item.includes(term))) score += 40;
    if (haystacks.whenToUse.some((item) => item.includes(term))) score += 20;
    if (haystacks.summary.includes(term)) score += 15;
    if (haystacks.description.includes(term)) score += 10;
  }

  return score;
}

export function searchGuides(query: string): GuideMetadata[] {
  return Object.values(guideRegistry)
    .map((guide) => ({ guide, score: scoreGuide(guide, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.guide.name.localeCompare(b.guide.name))
    .map(({ guide }) => guide);
}

export type { GuideMetadata, GuideRegistry, GuideCategory, GuideStep } from '../types.js';
