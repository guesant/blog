import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { genericPreview } from './generic-preview';
import { youtubePreview } from './youtube-preview';
import type { SourcePreviewData } from './types';

type YoutubeOrGenericPreviewProps = {
  item: Reference;
  link: ExternalLink;
  url: URL;
};

export function youtubeOrGenericPreview(props: YoutubeOrGenericPreviewProps): SourcePreviewData {
  return (
    youtubePreview(props.item, props.link, props.url) ??
    genericPreview(props.item, props.link, props.url)
  );
}
