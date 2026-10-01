import { buildContentFeedFormViewBase } from './build-content-feed-form-view-base';
import type {
  ContentFeedFormViewProps,
  UseContentFeedViewPropsInput,
} from './use-content-feed-view-props.types';

export function buildContentFeedFormViewProps(
  input: UseContentFeedViewPropsInput,
): ContentFeedFormViewProps {
  const { runtime } = input;

  const { actions, translations } = runtime;

  const base = buildContentFeedFormViewBase(input);

  return {
    ...base,
    applyLabel: translations.applyLabel,
    clearLabel: translations.clearLabel,
    onPendingSearchChange: runtime.state.setPendingSearch,
    onSubmit: actions.applyFilters,
    modeLabel: translations.modeLabel,
    paginationModeLabel: translations.paginationModeLabel,
    infiniteModeLabel: translations.infiniteModeLabel,
    perPageLabel: translations.perPageLabel,
    onDisplayModeChange: actions.setDisplayMode,
    onPerPageChange: actions.setPerPage,
  };
}
