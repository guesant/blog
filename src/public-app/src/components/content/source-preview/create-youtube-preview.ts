import type { ExternalLink, Reference } from '@portfolio/data/domain/types';
import { youtubePreviewIcon } from './youtube-preview-icon';
import { youtubePreviewImage } from './youtube-preview-image';
import { youtubePreviewMetadata } from './youtube-preview-metadata';
import { nonEmpty } from './source-preview-non-empty';
import { sourcePreviewFirstValue } from './source-preview-first-value';
import { sourcePreviewFirstText } from './source-preview-first-text';
import type { YoutubePreviewIdentity } from './resolve-youtube-preview-kind';
import type { SourcePreviewData } from './types';

type CreateYoutubePreviewProps = {
  item: Reference;
  link: ExternalLink;
  identity: YoutubePreviewIdentity;
};

export function createYoutubePreview(props: CreateYoutubePreviewProps): SourcePreviewData {
  const metadataEntries = youtubePreviewMetadata(props);

  const fallbackImage = youtubePreviewImage(props.identity);

  return {
    provider: 'youtube',
    kind: props.identity.kind,
    url: props.link.url,
    title: sourcePreviewFirstText([nonEmpty(props.link.openGraph?.title), props.item.title]),
    description: sourcePreviewFirstText([
      nonEmpty(props.link.openGraph?.description),
      props.item.description,
    ]),
    imageUrl: sourcePreviewFirstValue([
      nonEmpty(props.item.image),
      nonEmpty(props.link.openGraph?.image),
      fallbackImage,
    ]),
    icon: youtubePreviewIcon(props.identity.kind),
    metadata: metadataEntries,
    filterType: props.item.type,
  };
}
