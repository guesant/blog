import type { Reference } from '@portfolio/data/domain/types';
import { metadata } from './source-preview-metadata';
import type { YoutubePreviewIdentity } from './resolve-youtube-preview-kind';
import type { SourcePreviewMetadata } from './types';

type YoutubeDurationMetadataProps = {
  item: Reference;
  identity: YoutubePreviewIdentity;
};

export function youtubeDurationMetadata(
  props: YoutubeDurationMetadataProps,
): SourcePreviewMetadata | undefined {
  return props.identity.kind === 'video'
    ? metadata('duration', props.item.video?.duration)
    : undefined;
}
