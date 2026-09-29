import type { RouteData } from '../../data/queries';

type ArticleRouteData = Extract<
  RouteData,
  { kind: 'case-detail' | 'finding-detail' | 'writing-detail' }
>;

export function articleDescription(data: ArticleRouteData): string {
  if ('summary' in data.item) {
    return data.item.summary;
  }

  if ('description' in data.item) {
    return data.item.description;
  }

  return data.item.excerpt ?? '';
}
