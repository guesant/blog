import type { FeedEntry } from './types';

type ContentFeedVisibleEntriesProps = {
  entries: FeedEntry[];
  page: number;
  pageSize: number;
  serverManaged: boolean;
};

export function contentFeedVisibleEntries(props: ContentFeedVisibleEntriesProps): FeedEntry[] {
  if (props.serverManaged) {
    return props.entries;
  }

  const start = (props.page - 1) * props.pageSize;

  return props.entries.slice(start, props.page * props.pageSize);
}
