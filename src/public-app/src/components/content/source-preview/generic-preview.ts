import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { genericPreviewDescription } from './generic-preview-description';
import { genericPreviewMetadata } from './generic-preview-metadata';
import { genericPreviewTitle } from './generic-preview-title';
import type { SourcePreviewData } from './types';

export function genericPreview(item: Reference, link: ExternalLink, url: URL): SourcePreviewData {
  const host = url.hostname.replace(/^www\./, '');

  const title = genericPreviewTitle({ link, host });

  return {
    provider: 'generic',
    kind: 'link',
    url: link.url,
    title,
    description: genericPreviewDescription({ link, host }),
    icon: 'external',
    metadata: genericPreviewMetadata({ link, host }),
    filterType: item.type,
  };
}
