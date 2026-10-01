import type { RouteData } from '../../data/queries';
import type { Locale } from '../../i18n/compat-support';
import type { RouteMetadata } from './splat-support';
import { articleMetadataForContent } from './splat-metadata-article-content';
import { defaultMetadata } from './splat-metadata-default';

export function articleEntityMetadata(data: RouteData, _locale: Locale): RouteMetadata {
  if (data.kind !== 'project-detail' && data.kind !== 'experiment-detail') {
    return defaultMetadata();
  }

  const source = data.kind === 'project-detail' ? data.project : data.experiment;

  return articleMetadataForContent({
    source,
    title: source.name,
    description: source.purpose,
  });
}
