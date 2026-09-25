import type { RouteData } from '../../data/queries';
import type { RouteMetadata } from './splat-support';
import { defaultMetadata } from './splat-metadata-default';
import { contentMetadata } from './splat-metadata-content';

export function articleMetadata(data: RouteData): RouteMetadata {
  if (data.kind === 'case-detail') {
    return contentMetadata({
      source: data.item,
      title: data.item.title,
      description: data.item.summary,
      type: 'article',
    });
  }
  if (data.kind === 'finding-detail') {
    return contentMetadata({
      source: data.item,
      title: data.item.title,
      description: data.item.description,
      type: 'article',
    });
  }
  if (data.kind === 'writing-detail') {
    return contentMetadata({
      source: data.item,
      title: data.item.title,
      description: data.item.excerpt,
      type: 'article',
    });
  }

  return defaultMetadata();
}
