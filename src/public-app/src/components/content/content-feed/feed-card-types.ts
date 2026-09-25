import type { FeedEntry, FeedQuickFilter } from './types';

export type FeedCardProps = {
  entry: FeedEntry;
  locale: string;
  t: (key: string) => string;
  onQuickFilter?: (filter: FeedQuickFilter) => void;
  showSourcePreviews?: boolean;
};
