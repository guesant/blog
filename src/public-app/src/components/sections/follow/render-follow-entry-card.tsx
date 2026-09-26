import type { FollowEntry } from './types';
import { FollowEntryCard } from './follow-entry-card';

export function renderFollowEntryCard(entry: FollowEntry) {
  return <FollowEntryCard entry={entry} />;
}
