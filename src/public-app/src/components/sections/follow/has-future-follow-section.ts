import type { FollowPageCopy } from '@portfolio/data/domain/types';

export function hasFutureFollowSection(page: FollowPageCopy): boolean {
  return Boolean(page.futureTitle || page.futureEntries.length);
}
