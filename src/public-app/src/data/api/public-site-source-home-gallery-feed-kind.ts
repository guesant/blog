import type { HomeGalleryEntryKind } from '../domain/pages-content';

export function homeGalleryFeedKind(kind: string): HomeGalleryEntryKind {
  if (kind === 'achado') {
    return 'finding';
  }

  if (kind === 'colecao') {
    return 'collection';
  }

  return 'writing';
}
