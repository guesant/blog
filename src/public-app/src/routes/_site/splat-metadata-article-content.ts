import type { RouteMetadata } from './splat-support';
import { contentMetadata } from './splat-metadata-content';

type ArticleContentMetadataSource = {
  ogImageUrl?: string;
};

export type ArticleContentMetadataProps = {
  source: ArticleContentMetadataSource;
  title: string;
  description: string;
};

export function articleMetadataForContent(props: ArticleContentMetadataProps): RouteMetadata {
  return contentMetadata({
    source: props.source,
    title: props.title,
    description: props.description,
    type: 'article',
  });
}
