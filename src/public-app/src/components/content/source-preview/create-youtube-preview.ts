import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { sourcePreviewFirstText } from './source-preview-first-text';
import { youtubePreviewIcon } from './youtube-preview-icon';
import type { YoutubePreviewIdentity } from './resolve-youtube-preview-kind';
import type { SourcePreviewData } from './types';

type CreateYoutubePreviewProps = {
  item: Reference;
  link: ExternalLink;
  identity: YoutubePreviewIdentity;
};

export function createYoutubePreview(props: CreateYoutubePreviewProps): SourcePreviewData {
  return {
    provider: 'youtube',
    kind: props.identity.kind,
    url: props.link.url,
    title: props.item.title,
    description: sourcePreviewFirstText([props.item.description]),
    icon: youtubePreviewIcon(props.identity.kind),
    metadata: [],
    filterType: props.item.type,
  };
}
