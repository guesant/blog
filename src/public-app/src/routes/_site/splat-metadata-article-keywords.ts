import type { RouteData } from '../../data/queries';

type ArticleItem = Extract<
  RouteData,
  { kind: 'case-detail' | 'finding-detail' | 'writing-detail' }
>['item'];

export function articleMetadataKeywords(item: ArticleItem): string[] {
  return [
    ...('type' in item ? [item.type] : []),
    ...('topics' in item ? item.topics : []),
    ...('tags' in item ? item.tags : []),
    ...('technologies' in item ? item.technologies : []),
  ].filter((keyword): keyword is string => Boolean(keyword));
}
