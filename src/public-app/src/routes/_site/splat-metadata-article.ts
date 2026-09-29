import type { RouteData } from '../../data/queries';
import type { RouteMetadata } from './splat-support';
import { defaultMetadata } from './splat-metadata-default';
import { contentMetadata } from './splat-metadata-content';
import { articleDescription } from './splat-metadata-article-description';

export function articleMetadata(data: RouteData): RouteMetadata {
  const articleKinds = ['case-detail', 'finding-detail', 'writing-detail'] as const;

  if (!articleKinds.includes(data.kind as (typeof articleKinds)[number])) {
    return defaultMetadata();
  }

  const articleData = data as Extract<
    RouteData,
    { kind: 'case-detail' | 'finding-detail' | 'writing-detail' }
  >;

  return contentMetadata({
    source: articleData.item,
    title: articleData.item.title,
    description: articleDescription(articleData),
    type: 'article',
  });
}
