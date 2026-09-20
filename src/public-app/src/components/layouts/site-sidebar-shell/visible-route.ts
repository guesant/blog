import type { SiteText } from '@portfolio/data/domain/types';
import { featureFlags } from '@portfolio/data/config/feature-flags';
import { routeSegment } from './route-segment';

const routeVisibilityKeys: Record<string, keyof NonNullable<SiteText['visibility']>> = {
  about: 'about',
  cases: 'cases',
  contact: 'contact',
  credits: 'credits',
  feed: 'feed',
  findings: 'findings',
  follow: 'follow',
  license: 'license',
  portfolio: 'portfolio',
  resume: 'resume',
  writing: 'writing',
  topics: 'topics',
  collections: 'collections',
  snippets: 'snippets',
};

export function visibleRoute(route: string, site: SiteText) {
  if (routeSegment(route) === 'tools') {
    return featureFlags.tools;
  }

  const visibilityKey = routeVisibilityKeys[routeSegment(route)];

  return visibilityKey ? (site.visibility?.[visibilityKey] ?? true) : true;
}
