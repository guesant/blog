import type { YoutubePreviewIdentity } from './resolve-youtube-preview-kind';
import { stringValue } from '@portfolio/data/api/public-site-source-string-value';
import { youtubeChannelHandle } from './youtube-channel-handle';

type YoutubeChannelPreviewIdentityProps = {
  first?: string;
  second?: string;
};

export function youtubeChannelPreviewIdentity(
  props: YoutubeChannelPreviewIdentityProps,
): YoutubePreviewIdentity | undefined {
  const handle = youtubeChannelHandle(props.first);

  if (handle) {
    return { kind: 'channel', identifier: handle };
  }

  if (!props.second) {
    return undefined;
  }

  if (['channel', 'c', 'user'].includes(stringValue(props.first))) {
    return { kind: 'channel', identifier: props.second };
  }

  return undefined;
}
