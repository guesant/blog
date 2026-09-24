import { contentFeedShowPagination } from './content-feed-show-pagination';
import type { ContentFeedProps, ContentFeedDisplayMode } from './types';

type BuildContentFeedShowPaginationProps = Pick<ContentFeedProps, 'showPagination'> & {
  displayMode: ContentFeedDisplayMode;
};

export function buildContentFeedShowPagination(props: BuildContentFeedShowPaginationProps) {
  if (!contentFeedShowPagination(props.showPagination)) {
    return false;
  }

  return props.displayMode === 'pagination';
}
