import type { IconName } from '../../primitives/icon';
import { routeSegment } from './route-segment';

const routeIcons: Partial<Record<string, IconName>> = {
  about: 'user',
  resume: 'graduation-cap',
  writing: 'pen-line',
  findings: 'search',
  topics: 'tag',
  collections: 'book',
  technologies: 'wrench',
  snippets: 'document',
  cases: 'briefcase',
  projects: 'layout-grid',
  portfolio: 'layout-grid',
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
