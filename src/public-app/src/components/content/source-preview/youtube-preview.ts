import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { pathSegments } from './source-preview-path-segments';
import { createYoutubePreview } from './create-youtube-preview';
import { resolveYoutubePreviewKind } from './resolve-youtube-preview-kind';
import { youtubePlaylistId } from './youtube-playlist-id';
import { youtubeVideoId } from './youtube-video-id';
import type { SourcePreviewData } from './types';

export function youtubePreview(
  item: Reference,
  link: ExternalLink,
  url: URL,
): SourcePreviewData | undefined {
  const segments = pathSegments(url);

  const videoId = youtubeVideoId(item, url);

  const playlistId = youtubePlaylistId(item, url);

  const identity = resolveYoutubePreviewKind({
    host: url.hostname,
    first: segments[0],
    second: segments[1],
    videoId,
    playlistId,
  });

  if (!identity) {
    return undefined;
  }

  return createYoutubePreview({ item, link, identity });
}
