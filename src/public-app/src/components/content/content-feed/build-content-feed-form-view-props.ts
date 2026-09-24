import type {
  ContentFeedFormViewProps,
  UseContentFeedViewPropsInput,
} from './use-content-feed-view-props.types';
import { buildContentFeedShowPagination } from './build-content-feed-show-pagination';

export function buildContentFeedFormViewProps(
  input: UseContentFeedViewPropsInput,
): ContentFeedFormViewProps {
  const { props, runtime, selects } = input;

  return {
    copy: props.copy,
    breadcrumbs: props.breadcrumbs,
    showHeader: props.showHeader ?? true,
    showPagination: buildContentFeedShowPagination({
      showPagination: props.showPagination,
      displayMode: runtime.state.displayMode,
    }),
    selects: selects ?? [],
    pendingSearch: runtime.state.pendingSearch,
    searchLabel: runtime.translations.searchLabel,
    applyLabel: runtime.translations.applyLabel,
    clearLabel: runtime.translations.clearLabel,
    onPendingSearchChange: runtime.state.setPendingSearch,
    onSubmit: runtime.actions.applyFilters,
    displayControls: props.displayControls ?? false,
    displayMode: runtime.state.displayMode,
    perPage: runtime.state.perPage,
    modeLabel: runtime.translations.modeLabel,
    paginationModeLabel: runtime.translations.paginationModeLabel,
    infiniteModeLabel: runtime.translations.infiniteModeLabel,
    perPageLabel: runtime.translations.perPageLabel,
    onDisplayModeChange: runtime.actions.setDisplayMode,
    onPerPageChange: runtime.actions.setPerPage,
  };
}
