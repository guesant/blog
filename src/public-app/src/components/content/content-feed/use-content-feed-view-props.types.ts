import type { ContentFeedProps } from './types';
import type { ContentFeedViewProps } from './content-feed-view';
import type { useContentFeedRuntime } from './use-content-feed-runtime';
import type { FeedSelectDefinition } from './feed-select.types';

export type UseContentFeedViewPropsInput = {
  props: ContentFeedProps;
  runtime: ReturnType<typeof useContentFeedRuntime>;
  selects?: FeedSelectDefinition[];
};

export type ContentFeedFormViewProps = Pick<
  ContentFeedViewProps,
  | 'copy'
  | 'showHeader'
  | 'showPagination'
  | 'selects'
  | 'pendingSearch'
  | 'searchLabel'
  | 'applyLabel'
  | 'clearLabel'
  | 'onPendingSearchChange'
  | 'onSubmit'
  | 'displayControls'
  | 'displayMode'
  | 'perPage'
  | 'modeLabel'
  | 'paginationModeLabel'
  | 'infiniteModeLabel'
  | 'perPageLabel'
  | 'onDisplayModeChange'
  | 'onPerPageChange'
>;

export type ContentFeedPaginationViewProps = Pick<
  ContentFeedViewProps,
  | 'count'
  | 'visibleEntries'
  | 'hasActiveFilters'
  | 'noResultsLabel'
  | 'emptyLabel'
  | 'locale'
  | 't'
  | 'onClear'
  | 'onQuickFilter'
  | 'page'
  | 'pageCount'
  | 'ariaLabel'
  | 'firstLabel'
  | 'previousLabel'
  | 'nextLabel'
  | 'lastLabel'
  | 'onPageChange'
  | 'progressive'
>;
