import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { sourcePreviewDataForLink } from './source-preview-data-for-link';
import type { SourcePreviewData } from './types';

export function sourcePreviewEntriesForLink(
  item: Reference,
  link: ExternalLink,
): SourcePreviewData[] {
  const preview = sourcePreviewDataForLink(item, link);

  return preview ? [preview] : [];
}
