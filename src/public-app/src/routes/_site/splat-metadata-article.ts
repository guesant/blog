import type { RouteData } from '../../data/queries';
import type { RouteMetadata } from './splat-support';
import { defaultMetadata } from './splat-metadata-default';

export function articleMetadata(data: RouteData): RouteMetadata {
  if (data.kind === 'case-detail') {
    return { title: data.item.title, description: data.item.summary, type: 'article' };
  }
  if (data.kind === 'finding-detail') {
    return { title: data.item.title, description: data.item.description, type: 'article' };
  }
  return data.kind === 'writing-detail'
    ? { title: data.item.title, description: data.item.excerpt, type: 'article' }
    : defaultMetadata();
}
