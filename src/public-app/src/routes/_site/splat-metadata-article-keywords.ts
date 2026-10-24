import type { RouteData } from '../../data/queries';

type ArticleItem = Extract<RouteData, { kind: 'case-detail' | 'writing-detail' }>['item'];

export function articleMetadataKeywords(item: ArticleItem): string[] {
  const keywordFields = new Set(['type', 'tags', 'technologies']);

  return Object.entries(item)
    .filter(([key]) => keywordFields.has(key))
    .flatMap(([, value]) => (Array.isArray(value) ? value : [value]))
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
}
