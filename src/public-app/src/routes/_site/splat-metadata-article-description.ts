import type { RouteData } from '../../data/queries';
import { plainText } from '../../components/content/plain-text';

type ArticleRouteData = Extract<RouteData, { kind: 'writing-detail' }>;

export function articleDescription(data: ArticleRouteData): string {
  if ('summary' in data.item && typeof data.item.summary === 'string') {
    return data.item.summary;
  }

  if ('body' in data.item) {
    return plainText(data.item.body);
  }

  return '';
}
