import type { RouteMetadata } from './_site/splat-support';
import type { SiteRouteHeadValues } from './site-route-head-values';
import type { SiteRouteHeadMetaItem } from './site-route-head-meta-extras';
import { siteRouteHeadMetaExtras } from './site-route-head-meta-extras';

export function siteRouteHeadMeta(metadata: RouteMetadata, values: SiteRouteHeadValues) {
  const meta: SiteRouteHeadMetaItem[] = [
    { title: `${metadata.title} - guesant.net` },
    { name: 'description', content: metadata.description },
    { property: 'og:title', content: metadata.title },
    { property: 'og:description', content: metadata.description },
    { property: 'og:url', content: values.canonicalUrl },
    { property: 'og:type', content: metadata.type ?? 'website' },
    { property: 'og:image', content: values.imageUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: metadata.title },
    { name: 'twitter:description', content: metadata.description },
    { name: 'twitter:image', content: values.imageUrl },
  ];

  return [...meta, ...siteRouteHeadMetaExtras(metadata)];
}
