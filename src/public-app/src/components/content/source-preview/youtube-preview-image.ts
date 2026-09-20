import type { YoutubePreviewIdentity } from './resolve-youtube-preview-kind';

export function youtubePreviewImage(identity: YoutubePreviewIdentity): string | undefined {
  if (identity.kind !== 'video') {
    return undefined;
  }

  return `https://i.ytimg.com/vi/${encodeURIComponent(identity.identifier)}/hqdefault.jpg`;
}
