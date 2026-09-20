import type { FeedEntry } from './types';
import { contentFeedPageCount } from './content-feed-page-count';
import { contentFeedPageNumber } from './content-feed-page-number';
import { contentFeedPageSize } from './content-feed-page-size';
import { contentFeedRequestedPage } from './content-feed-requested-page';
import { contentFeedVisibleEntries } from './content-feed-visible-entries';

type ContentFeedPageDataProps = {
  entries: FeedEntry[];
  findingsMeta?: { total: number; perPage: number; page: number };
  initialPage: number;
  pageFromQuery: number;
  serverManaged: boolean;
};

export function contentFeedPageData(props: ContentFeedPageDataProps) {
  const pageSize = contentFeedPageSize(props.findingsMeta?.perPage);

  const total = props.findingsMeta?.total ?? props.entries.length;

  const pageCount = contentFeedPageCount(total, pageSize);

  const requestedPage = contentFeedRequestedPage(props.pageFromQuery, props.initialPage);

  const page = contentFeedPageNumber({
    serverManaged: props.serverManaged,
    serverPage: props.findingsMeta?.page,
    requestedPage,
    pageCount,
  });

  const visibleEntries = contentFeedVisibleEntries({
    entries: props.entries,
    page,
    pageSize,
    serverManaged: props.serverManaged,
  });

  return { pageCount, page, visibleEntries };
}
