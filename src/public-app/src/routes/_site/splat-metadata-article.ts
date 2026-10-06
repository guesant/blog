import type { RouteData } from '../../data/queries';
import type { RouteMetadata } from './splat-support';
import { defaultMetadata } from './splat-metadata-default';
import { contentMetadata } from './splat-metadata-content';
import { articleDescription } from './splat-metadata-article-description';
import { articleMetadataKeywords } from './splat-metadata-article-keywords';
import { localizedFindingDisplayTitle } from '../../i18n/localized-finding-display-title';
import type { Locale } from '../../i18n/compat-support';

export function articleMetadata(data: RouteData, locale: Locale): RouteMetadata {
  const articleKinds = ['case-detail', 'finding-detail', 'writing-detail'] as const;

  if (!articleKinds.includes(data.kind as (typeof articleKinds)[number])) {
    return defaultMetadata();
  }

  const articleData = data as Extract<
    RouteData,
    { kind: 'case-detail' | 'finding-detail' | 'writing-detail' }
  >;

  const source = 'ogImageUrl' in articleData.item ? articleData.item : undefined;

  const title =
    articleData.kind === 'finding-detail'
      ? localizedFindingDisplayTitle(articleData.item.title, articleData.item.type, locale)
      : articleData.item.title;

  return contentMetadata({
    source,
    title,
    description: articleDescription(articleData),
    type: 'article',
    keywords: articleMetadataKeywords(articleData.item),
  });
}
