import type {
  ContentFeedPaginationViewProps,
  UseContentFeedViewPropsInput,
} from './use-content-feed-view-props.types';
import { contentFeedPaginationCount } from './content-feed-pagination-count';

export function buildContentFeedPaginationViewProps(
  input: UseContentFeedViewPropsInput,
): ContentFeedPaginationViewProps {
  const { runtime } = input;

  const count = contentFeedPaginationCount(input);

  return {
    count,
    visibleEntries: runtime.data.visibleEntries,
    hasActiveFilters: runtime.data.hasActiveFilters,
    noResultsLabel: runtime.translations.noResultsLabel,
    emptyLabel: runtime.translations.emptyLabel,
    locale: runtime.locale,
    t: runtime.translations.tPages,
    onClear: runtime.actions.clearFilters,
    onQuickFilter: runtime.actions.applyQuickFilter,
    page: runtime.data.page,
    pageCount: runtime.data.pageCount,
    ariaLabel: runtime.translations.paginationLabel,
    previousLabel: runtime.translations.previousLabel,
    nextLabel: runtime.translations.nextLabel,
    pageInputLabel: runtime.translations.pageInputLabel,
    pageOfLabel: runtime.translations.pageOfLabel,
    onPageChange: (value) =>
      runtime.router.push(runtime.actions.pageHref(value), { resetScroll: false }),
  };
}
