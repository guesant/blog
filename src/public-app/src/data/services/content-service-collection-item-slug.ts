import type { ContentReference } from '../domain/types.ts';
import { referenceSlug } from './content-service-reference-slug';

export function collectionItemSlug(item: ContentReference | undefined): string | undefined {
  if (!item) {
    return undefined;
  }
  return referenceSlug(item);
}
