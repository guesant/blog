'use client';

import { ListingView } from '../listing-view';
import type { FeedEntry, FeedQuickFilter } from './types';
import { useTranslations } from '@/i18n/compat';
import { FeedCard } from './feed-card';

type ContentFeedResultsProps = {
  entries: FeedEntry[];
  locale: string;
  t: ReturnType<typeof useTranslations>;
  onQuickFilter: (filter: FeedQuickFilter) => void;
};

export function ContentFeedResults(props: ContentFeedResultsProps) {
  return (
    <ListingView
      items={props.entries}
      getKey={(entry) => `${entry.kind}-${entry.slug}`}
      renderListItem={(entry) => (
        <FeedCard
          entry={entry}
          locale={props.locale}
          t={props.t}
          onQuickFilter={props.onQuickFilter}
        />
      )}
    />
  );
}
