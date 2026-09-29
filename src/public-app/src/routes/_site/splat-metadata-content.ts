import type { RouteMetadata } from './splat-support';
import { defaultMetadata } from './splat-metadata-default';
import { firstText } from './splat-metadata-first-text';
import { metadataImage } from './-splat-metadata-image';
import type { SeoMetadata } from '../../data/domain/content';

type MetadataSource = {
  seo?: SeoMetadata;
  ogImageUrl?: string;
};

type ContentMetadataProps = {
  source?: MetadataSource;
  title: string;
  description: string;
  type?: string;
};

export function contentMetadata(props: ContentMetadataProps): RouteMetadata {
  const fallback = defaultMetadata();

  const seo = props.source?.seo ?? {};

  return {
    ...seo,
    title: firstText(seo.title, props.title, fallback.title),
    description: firstText(seo.description, props.description, fallback.description),
    type: props.type,
    image: metadataImage(props.source),
  };
}
