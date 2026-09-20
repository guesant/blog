import type { Reference } from '@portfolio/data/domain/types';

export function findingPreview(item: Reference): string {
  return item.personalNote || item.reasonFound || item.description;
}
