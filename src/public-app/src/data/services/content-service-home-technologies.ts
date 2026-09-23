import type { HomePageCopy, TechnologyBadge } from '../domain/types.ts';

export function homeTechnologies(page: HomePageCopy): TechnologyBadge[] {
  if (page.recurringTechnologies) return page.recurringTechnologies;

  return [];
}
