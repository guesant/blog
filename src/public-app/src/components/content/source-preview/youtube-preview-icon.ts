import type { YoutubePreviewKind } from './resolve-youtube-preview-kind';

const youtubePreviewIcons = {
  channel: 'tv',
  playlist: 'list-video',
  video: 'video',
} as const;

export function youtubePreviewIcon(
  kind: YoutubePreviewKind,
): (typeof youtubePreviewIcons)[YoutubePreviewKind] {
  return youtubePreviewIcons[kind];
}
