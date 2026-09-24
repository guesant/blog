import { contentFeedDisplayMode } from './content-feed-display-mode';
import { contentFeedPageSizeValue } from './content-feed-page-size-value';
import type { ContentFeedDisplayMode, ContentFeedProps } from './types';

type ReadContentFeedDisplayStateProps = Pick<
  ContentFeedProps,
  'displayControls' | 'initialPerPage'
> & {
  query: URLSearchParams;
};

export function readContentFeedDisplayState(props: ReadContentFeedDisplayStateProps): {
  displayMode: ContentFeedDisplayMode;
  perPage: number;
} {
  const displayMode = props.displayControls
    ? contentFeedDisplayMode(props.query.get('view'), 'pagination')
    : 'pagination';

  return {
    displayMode,
    perPage: contentFeedPageSizeValue(props.query.get('per_page'), props.initialPerPage ?? 10),
  };
}
