import type { YoutubePreviewIdentity } from './resolve-youtube-preview-kind';

type YoutubeVideoPreviewIdentityProps = {
  host: string;
  first?: string;
  videoId?: string;
};

export function youtubeVideoPreviewIdentity(
  props: YoutubeVideoPreviewIdentityProps,
): YoutubePreviewIdentity | undefined {
  if (props.host === 'youtu.be' && props.first) {
    return { kind: 'video', identifier: props.first };
  }

  return props.videoId ? { kind: 'video', identifier: props.videoId } : undefined;
}
