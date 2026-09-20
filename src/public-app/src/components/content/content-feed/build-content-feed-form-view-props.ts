import type {
  ContentFeedFormViewProps,
  UseContentFeedViewPropsInput,
} from './use-content-feed-view-props.types';

export function buildContentFeedFormViewProps(
  input: UseContentFeedViewPropsInput,
): ContentFeedFormViewProps {
  const { props, runtime, selects } = input;

  return {
    copy: props.copy,
    showHeader: props.showHeader ?? true,
    selects: selects ?? [],
    pendingSearch: runtime.state.pendingSearch,
    searchLabel: runtime.translations.searchLabel,
    applyLabel: runtime.translations.applyLabel,
    clearLabel: runtime.translations.clearLabel,
    onPendingSearchChange: runtime.state.setPendingSearch,
    onSubmit: runtime.actions.applyFilters,
  };
}
