import type { ExternalLink } from '@portfolio/data/domain/types';
import { metadata } from './source-preview-metadata';
import type { SourcePreviewMetadata } from './types';

type GenericPreviewMetadataProps = {
  link: ExternalLink;
  host: string;
};

export function genericPreviewMetadata(
  props: GenericPreviewMetadataProps,
): SourcePreviewMetadata[] {
  return [
    metadata('host', props.host),
    metadata('siteName', props.link.openGraph?.siteName),
    metadata('contentType', props.link.openGraph?.type),
  ].filter((entry): entry is SourcePreviewMetadata => entry !== undefined);
}
