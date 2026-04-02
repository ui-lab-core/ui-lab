import { getAllGuides, getGuideById, searchGuides } from 'ui-lab-registry';

export const guidesAdapter = {
  getById: (id: string) => {
    try {
      return getGuideById(id) ?? null;
    } catch {
      return null;
    }
  },
  search: (query: string, limit = 10) => {
    try {
      return searchGuides(query).slice(0, limit);
    } catch {
      return [];
    }
  },
  getAll: () => {
    try {
      return getAllGuides();
    } catch {
      return [];
    }
  },
};
