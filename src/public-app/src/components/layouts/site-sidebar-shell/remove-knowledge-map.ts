import type { NavigationItem } from '@portfolio/data/domain/types';
import { routeSegment } from './route-segment';

export function removeKnowledgeMap(item: NavigationItem): NavigationItem | undefined {
  if (routeSegment(item.route) === 'knowledge-map') {
    return undefined;
  }
  return {
    ...item,
    children: item.children
      .map(removeKnowledgeMap)
      .filter((child): child is NavigationItem => child !== undefined),
  };
}
