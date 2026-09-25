import type { PageIntroduction } from '../../data/domain/types';
import type { RouteMetadata } from './splat-support';
import { contentMetadata } from './splat-metadata-content';

export function metadataFromPage(page: PageIntroduction): RouteMetadata {
  return contentMetadata({
    source: page,
    title: page.title,
    description: page.description,
  });
}
