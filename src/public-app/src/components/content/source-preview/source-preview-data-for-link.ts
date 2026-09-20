import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { parsedUrl } from './source-preview-parsed-url';
import { sourcePreviewForHost } from './source-preview-for-host';
import type { SourcePreviewData } from './types';

export function sourcePreviewDataForLink(
  item: Reference,
  link: ExternalLink,
): SourcePreviewData | undefined {
  const url = parsedUrl(link.url);

  if (!url) {
    return undefined;
  }

  return sourcePreviewForHost({ item, link, url });
}
