import type { RouteData } from '../data/queries';
import { metadataForRoute } from './_site/splat-metadata-for-route';
import { routeContext } from './site-route-context';

export type SiteRouteHeadProps = {
  loaderData: RouteData | undefined;
  pathname: string;
};

export function siteRouteHead(props: SiteRouteHeadProps) {
  const { locale } = routeContext(props.pathname);

  const metadata = metadataForRoute(props.loaderData, locale);

  return {
    meta: [
      { title: `${metadata.title} - guesant.net` },
      { name: 'description', content: metadata.description },
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
      { property: 'og:type', content: metadata.type ?? 'website' },
    ],
  };
}
