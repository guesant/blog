import type { FeedQuickFilter } from './types';
import type { SourcePreviewData } from '../source-preview/types';

export function handleSourceKindClick(
  onQuickFilter: (filter: FeedQuickFilter) => void,
  data: SourcePreviewData,
) {
  if (data.filterType) {
    onQuickFilter({ kind: 'achado', type: data.filterType });
  }
}
