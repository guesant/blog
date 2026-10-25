import type { IconName } from '../../primitives/icon';
import { routeSegment } from '../../navigation/route-segment';

const routeIcons: Partial<Record<string, IconName>> = {
  about: 'user',
  writing: 'pen-line',
  topics: 'tag',
  collections: 'book',
  technologies: 'wrench',
  snippets: 'document',
  now: 'clock',
  contact: 'mail',
  license: 'scroll-text',
  credits: 'bookmark',
  follow: 'rss',
  'feed.xml': 'rss',
  'feed.json': 'newspaper',
};

export function iconForRoute(route: string): IconName | undefined {
  return route === '/' ? 'home' : routeIcons[routeSegment(route)];
}
