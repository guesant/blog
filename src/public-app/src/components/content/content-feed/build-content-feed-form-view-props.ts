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
    perPageLabel: translations.perPageLabel,
    onPerPageChange: actions.setPerPage,
  };
}
