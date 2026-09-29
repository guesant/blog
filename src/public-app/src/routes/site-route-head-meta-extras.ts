import type { RouteMetadata } from './_site/splat-support';
import { metadataRobots } from './_site/splat-metadata-robots';

export type SiteRouteHeadMetaItem = {
  content?: string;
  name?: string;
  property?: string;
  title?: string;
};

export function siteRouteHeadMetaExtras(metadata: RouteMetadata): SiteRouteHeadMetaItem[] {
  const extras: SiteRouteHeadMetaItem[] = [];

  if (metadata.imageAlt) {
    extras.push(
      { property: 'og:image:alt', content: metadata.imageAlt },
      { name: 'twitter:image:alt', content: metadata.imageAlt },
    );
  }

  if (metadata.keywords && metadata.keywords.length > 0) {
    extras.push({ name: 'keywords', content: metadata.keywords.join(', ') });
  }

  const robots = metadataRobots(metadata);

  if (robots) {
    extras.push({ name: 'robots', content: robots });
  }

  return extras;
}
