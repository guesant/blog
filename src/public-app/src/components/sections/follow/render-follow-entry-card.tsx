import type { FollowEntry } from './types';
import { ConditionalContent } from '../../primitives/conditional-content';
import { FollowEntryLinkCard } from './follow-entry-link-card';
import { FollowEntryStaticCard } from './follow-entry-static-card';

export function renderFollowEntryCard(entry: FollowEntry) {
  return (
    <>
      <ConditionalContent
        condition={Boolean(entry.url)}
        content={<FollowEntryLinkCard entry={entry} />}
      />
      <ConditionalContent
        condition={!entry.url}
        content={<FollowEntryStaticCard entry={entry} />}
      />
    </>
  );
}
