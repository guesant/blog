import type { RouteData } from '../../data/queries';
import { plainText } from '../../components/content/plain-text';

type ArticleRouteData = Extract<
  RouteData,
  { kind: 'case-detail' | 'finding-detail' | 'writing-detail' }
>;

export function articleDescription(data: ArticleRouteData): string {
  if ('summary' in data.item) {
    return data.item.summary;
  }

  if ('body' in data.item) {
    return plainText(data.item.body);
  }

  if ('excerpt' in data.item) {
    return typeof data.item.excerpt === 'string' ? data.item.excerpt : '';
  }

  return '';
}
