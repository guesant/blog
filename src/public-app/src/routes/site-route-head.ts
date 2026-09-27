import type { RouteData } from '../data/queries';
import { metadataForRoute } from './_site/splat-metadata-for-route';
import { routeContext } from './site-route-context';
import { siteRouteHeadLinks } from './site-route-head-links';
import { siteRouteHeadMeta } from './site-route-head-meta';
import { siteRouteHeadValues } from './site-route-head-values';

export type SiteRouteHeadProps = {
  loaderData: RouteData | undefined;
  pathname: string;
};

export function siteRouteHead(props: SiteRouteHeadProps) {
  const { locale } = routeContext(props.pathname);

  const metadata = metadataForRoute(props.loaderData, locale);

  const values = siteRouteHeadValues(props.pathname, locale, metadata);

  return {
    meta: siteRouteHeadMeta(metadata, values),
    links: siteRouteHeadLinks(values),
  };
}
