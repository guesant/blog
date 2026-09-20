import type { YoutubePreviewIdentity } from './resolve-youtube-preview-kind';

type YoutubePlaylistPreviewIdentityProps = {
  first?: string;
  playlistId?: string;
};

export function youtubePlaylistPreviewIdentity(
  props: YoutubePlaylistPreviewIdentityProps,
): YoutubePreviewIdentity | undefined {
  if ((props.first === 'playlist' || props.playlistId) && props.playlistId) {
    return { kind: 'playlist', identifier: props.playlistId };
  }

  return undefined;
}
