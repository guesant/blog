import type { Reference } from '@portfolio/data/domain/types';
import { metadata } from './source-preview-metadata';
import type { YoutubePreviewIdentity } from './resolve-youtube-preview-kind';
import type { SourcePreviewMetadata } from './types';

type YoutubeChannelMetadataProps = {
  item: Reference;
  identity: YoutubePreviewIdentity;
};

export function youtubeChannelMetadata(
  props: YoutubeChannelMetadataProps,
): SourcePreviewMetadata | undefined {
  return props.identity.kind === 'video' || props.identity.kind === 'playlist'
    ? metadata('channel', props.item.video?.channel)
    : undefined;
}
