import type { FeedEntry } from './types';
import { contentFeedPageCount } from './content-feed-page-count';
import { contentFeedPageNumber } from './content-feed-page-number';
import { contentFeedPageSize } from './content-feed-page-size';
import { contentFeedPageMeta } from './content-feed-page-meta';
import { contentFeedRequestedPage } from './content-feed-requested-page';

type ContentFeedPageDataProps = {
  entries: FeedEntry[];
  findingsMeta?: { total: number; perPage: number; page: number };
  contentMeta?: { total: number; perPage: number; page: number };
  initialPage: number;
  pageFromQuery: number;
};

export function contentFeedPageData(props: ContentFeedPageDataProps) {
  const meta = contentFeedPageMeta({
    findingsMeta: props.findingsMeta,
    contentMeta: props.contentMeta,
    entryCount: props.entries.length,
  });

  const pageSize = contentFeedPageSize(meta.perPage);

  const total = meta.total;

  const pageCount = contentFeedPageCount(total, pageSize);

  const requestedPage = contentFeedRequestedPage(props.pageFromQuery, props.initialPage);

  const page = contentFeedPageNumber({
    serverPage: meta.page,
    requestedPage,
    pageCount,
  });

  const visibleEntries = props.entries;

  return { pageCount, page, visibleEntries };
}
