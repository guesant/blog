import type { RouteData } from '../../data/queries';
import type { RouteMetadata } from './splat-support';
import { defaultMetadata } from './splat-metadata-default';

export function pageMetadata(data: RouteData): RouteMetadata {
  if (!('page' in data) || !('title' in data.page) || !('description' in data.page)) {
    return defaultMetadata();
  }
  return { title: data.page.title, description: data.page.description };
}
