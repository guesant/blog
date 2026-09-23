import type { RouteData } from '../data/queries';
import { metadataForRoute } from './_site/splat-metadata-for-route';

export type SiteRouteHeadProps = {
  loaderData: RouteData | undefined;
};

export function siteRouteHead(props: SiteRouteHeadProps) {
  const metadata = metadataForRoute(props.loaderData);

  return {
    meta: [
      { title: `${metadata.title} · guesant.net` },
      { name: 'description', content: metadata.description },
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
      { property: 'og:type', content: metadata.type ?? 'website' },
    ],
  };
}
