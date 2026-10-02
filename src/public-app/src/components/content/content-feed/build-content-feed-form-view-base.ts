import { buildContentFeedShowPagination } from './build-content-feed-show-pagination';
import { contentFeedShowSelects } from './content-feed-show-selects';
import type {
  ContentFeedFormViewProps,
  UseContentFeedViewPropsInput,
} from './use-content-feed-view-props.types';

export type ContentFeedFormViewBase = Pick<
  ContentFeedFormViewProps,
  | 'copy'
  | 'breadcrumbs'
  | 'showHeader'
  | 'showPagination'
  | 'selects'
  | 'showSelects'
  | 'pendingSearch'
  | 'searchLabel'
  | 'displayControls'
  | 'displayMode'
  | 'perPage'
>;

export function buildContentFeedFormViewBase(
  input: UseContentFeedViewPropsInput,
): ContentFeedFormViewBase {
  const { props, runtime, selects = [] } = input;

  const { state, translations } = runtime;

  const {
    showHeader = true,
    showPagination,
    searchPlaceholder: searchLabel = translations.searchLabel,
    displayControls = false,
  } = props;

  return {
    copy: props.copy,
    breadcrumbs: props.breadcrumbs,
    showHeader,
    showPagination: buildContentFeedShowPagination({
      showPagination,
      displayMode: state.displayMode,
    }),
    selects,
    showSelects: contentFeedShowSelects(props.showSelects),
    pendingSearch: state.pendingSearch,
    searchLabel,
    displayControls,
    displayMode: state.displayMode,
    perPage: state.perPage,
  };
}
