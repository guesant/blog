'use client';

import { CollectionListing } from '../collection-listing';
import type { FeedEntry, FeedQuickFilter } from './types';
import type { AchadosTranslator } from '@/i18n/compat-support';
import { FeedCard } from './feed-card';

type ContentFeedResultsProps = {
  entries: FeedEntry[];
  locale: string;
  t: AchadosTranslator;
  onQuickFilter: (filter: FeedQuickFilter) => void;
};

export function ContentFeedResults(props: ContentFeedResultsProps) {
  return (
    <CollectionListing
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
