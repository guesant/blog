import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { metadata } from './source-preview-metadata';
import type { YoutubePreviewIdentity } from './resolve-youtube-preview-kind';
import type { SourcePreviewMetadata } from './types';
import { youtubeChannelMetadata } from './youtube-channel-metadata';
import { youtubeDurationMetadata } from './youtube-duration-metadata';

type YoutubePreviewMetadataProps = {
  item: Reference;
  link: ExternalLink;
  identity: YoutubePreviewIdentity;
};

export function youtubePreviewMetadata(
  props: YoutubePreviewMetadataProps,
): SourcePreviewMetadata[] {
  return [
    youtubeChannelMetadata(props),
    youtubeDurationMetadata(props),
    metadata('identifier', props.identity.identifier),
    metadata('siteName', props.link.openGraph?.siteName),
    metadata('contentType', props.link.openGraph?.type),
  ].filter((entry): entry is SourcePreviewMetadata => entry !== undefined);
}
