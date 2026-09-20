type ResolveYoutubePreviewKindProps = {
  host: string;
  first?: string;
  second?: string;
  videoId?: string;
  playlistId?: string;
};

import { youtubeChannelPreviewIdentity } from './youtube-channel-preview-identity';
import { youtubePlaylistPreviewIdentity } from './youtube-playlist-preview-identity';
import { youtubeVideoPreviewIdentity } from './youtube-video-preview-identity';

export type YoutubePreviewKind = 'video' | 'playlist' | 'channel';

export type YoutubePreviewIdentity = {
  kind: YoutubePreviewKind;
  identifier: string;
};

export function resolveYoutubePreviewKind(
  props: ResolveYoutubePreviewKindProps,
): YoutubePreviewIdentity | undefined {
  return (
    youtubeVideoPreviewIdentity(props) ??
    youtubePlaylistPreviewIdentity(props) ??
    youtubeChannelPreviewIdentity(props)
  );
}
