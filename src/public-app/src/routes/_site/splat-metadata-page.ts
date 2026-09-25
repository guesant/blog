import type { RouteData } from '../../data/queries';
import type { RouteMetadata } from './splat-support';
import { defaultMetadata } from './splat-metadata-default';
import { metadataFromPage } from './splat-metadata-from-page';

export function pageMetadata(data: RouteData): RouteMetadata {
  if (!('page' in data)) {
    return defaultMetadata();
  }

  return metadataFromPage(data.page);
}
