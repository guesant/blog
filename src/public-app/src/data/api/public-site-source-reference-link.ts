import type { ExternalLink } from '../domain/types.ts';
import { RecordValue } from './public-site-source-support';
import { textValue } from './public-site-source-text-value';
import { openGraphMetadata } from './public-site-source-open-graph-metadata';
import { booleanValue } from './public-site-source-boolean-value';

export function referenceLink(link: RecordValue): ExternalLink {
  return {
    url: textValue(link.url),
    label: textValue(link.label) || undefined,
    platform: textValue(link.platform) || undefined,
    purpose: textValue(link.purpose) || undefined,
    isFree: booleanValue(link.is_free),
    isPrimary: booleanValue(link.is_primary),
    openGraph: openGraphMetadata(link.open_graph),
  };
}
