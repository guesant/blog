import type { FeedEntry, FeedQuickFilter } from './types';
import type { FeedTranslator } from '@/i18n/compat-support';

export type FeedCardProps = {
  entry: FeedEntry;
  locale: string;
  t: FeedTranslator;
  onQuickFilter?: (filter: FeedQuickFilter) => void;
  flatCards?: boolean;
};
