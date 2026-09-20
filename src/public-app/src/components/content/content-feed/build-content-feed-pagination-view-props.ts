import type {
  ContentFeedPaginationViewProps,
  UseContentFeedViewPropsInput,
} from './use-content-feed-view-props.types';

export function buildContentFeedPaginationViewProps(
  input: UseContentFeedViewPropsInput,
): ContentFeedPaginationViewProps {
  const { props, runtime } = input;

  const count = runtime.data.serverManaged
    ? (props.findingsMeta?.total ?? 0)
    : runtime.data.filteredEntries.length;

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
    firstLabel: runtime.translations.firstLabel,
    previousLabel: runtime.translations.previousLabel,
    nextLabel: runtime.translations.nextLabel,
    lastLabel: runtime.translations.lastLabel,
    onPageChange: (value) =>
      runtime.router.push(runtime.actions.pageHref(value), { resetScroll: false }),
  };
}
