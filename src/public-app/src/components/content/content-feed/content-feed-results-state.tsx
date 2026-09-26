'use client';

import { ContentFeedEmpty } from './content-feed-empty';
import { ContentFeedResults } from './content-feed-results';
import type { FeedEntry, FeedQuickFilter } from './types';
import type { AchadosTranslator } from '@/i18n/compat-support';

type ContentFeedResultsStateProps = {
  entries: FeedEntry[];
  hasActiveFilters: boolean;
  noResultsLabel: string;
  emptyLabel: string;
  clearLabel: string;
  onClear: () => void;
  locale: string;
  t: AchadosTranslator;
  onQuickFilter: (filter: FeedQuickFilter) => void;
};

export function ContentFeedResultsState(props: ContentFeedResultsStateProps) {
  if (props.entries.length === 0) {
    return (
      <ContentFeedEmpty
        hasActiveFilters={props.hasActiveFilters}
        noResultsLabel={props.noResultsLabel}
        emptyLabel={props.emptyLabel}
        clearLabel={props.clearLabel}
        onClear={props.onClear}
      />
    );
  }

  return (
    <ContentFeedResults
      entries={props.entries}
      locale={props.locale}
      t={props.t}
      onQuickFilter={props.onQuickFilter}
    />
  );
}
