import type { FeedEntry, FeedQuickFilter } from './types';
import type { AchadosTranslator } from '@/i18n/compat-support';

export type FeedCardProps = {
  entry: FeedEntry;
  locale: string;
  t: AchadosTranslator;
  onQuickFilter?: (filter: FeedQuickFilter) => void;
  showSourcePreviews?: boolean;
};
