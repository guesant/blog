import type { RouteMetadata } from './splat-support';
import { defaultMetadata } from './splat-metadata-default';
import { firstText } from './splat-metadata-first-text';
import { metadataImage } from './-splat-metadata-image';

type MetadataSource = {
  ogImageUrl?: string;
};

type ContentMetadataProps = {
  source?: MetadataSource;
  title: string;
  description: string;
  type?: string;
  keywords?: string[];
};

export function contentMetadata(props: ContentMetadataProps): RouteMetadata {
  const fallback = defaultMetadata();

  const title = firstText(props.title, fallback.title, fallback.title);

  return {
    title,
    description: firstText(props.description, fallback.description, fallback.description),
    type: props.type,
    image: metadataImage(props.source),
    imageAlt: title,
    robots: 'index, follow',
    keywords: props.keywords,
  };
}
