import type { SiteText } from '@portfolio/data/domain/types';
import { routeSegment } from './route-segment';

const routeVisibilityKeys: Record<string, keyof NonNullable<SiteText['visibility']>> = {
  about: 'about',
  contact: 'contact',
  credits: 'credits',
  feed: 'feed',
  follow: 'follow',
  license: 'license',
  topics: 'topics',
  collections: 'collections',
  snippets: 'snippets',
  writing: 'writing',
};

export function visibleRoute(route: string, site: Pick<SiteText, 'visibility'>): boolean {
  const visibilityKey = routeVisibilityKeys[routeSegment(route)];

  return visibilityKey ? (site.visibility?.[visibilityKey] ?? true) : true;
}
