import type { FollowPageCopy } from '@portfolio/data/domain/types';

export function hasCurrentFollowSection(page: FollowPageCopy): boolean {
  return Boolean(page.sectionLabel || page.sectionTitle || page.entries.length);
}
