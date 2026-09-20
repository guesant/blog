import type { ContentReference } from '../domain/types.ts';

export function referenceSlug(reference: ContentReference) {
  const path = typeof reference === 'string' ? reference : reference.item;

  const filename = path.split('/').at(-1) ?? path;

  return filename.replace(/\.json$/, '');
}
