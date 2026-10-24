import type { HomeGalleryEntryKind } from '../domain/pages-content';

export function homeGalleryFeedKind(kind: string): HomeGalleryEntryKind {
  if (kind === 'colecao') {
    return 'collection';
  }

  return 'writing';
}
