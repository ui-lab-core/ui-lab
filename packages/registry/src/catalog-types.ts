export type ElementCategoryId = 'layout' | 'form' | 'navigation' | 'content' | 'card' | 'documentation' | 'ai' | 'other';

export interface ElementCategoryDefinition {
  id: ElementCategoryId;
  name: string;
  label: string;
  description: string;
}

export type SectionCategoryId = 'hero' | 'cta' | 'features' | 'testimonials' | 'pricing' | 'faq' | 'contact' | 'other';

export interface SectionCategoryDefinition {
  id: SectionCategoryId;
  name: string;
  label: string;
  description: string;
}
