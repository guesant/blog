import type { RouteData } from '../data/queries';
import { getMessages } from '../i18n/messages';
import { lookup } from '../i18n/compat-lookup';
import { metadataForRoute } from './_site/splat-metadata-for-route';
import { routeContext } from './site-route-context';

export type SiteRouteHeadProps = {
  loaderData: RouteData | undefined;
  pathname: string;
};

export function siteRouteHead(props: SiteRouteHeadProps) {
  const metadata = metadataForRoute(props.loaderData);

  const { locale, pathname } = routeContext(props.pathname);

  const homeTitle = lookup(getMessages(locale), 'Nav.home');

  const title = pathname === '/' && typeof homeTitle === 'string' ? homeTitle : metadata.title;

  return {
    meta: [
      { title: `${title} - guesant.net` },
      { name: 'description', content: metadata.description },
      { property: 'og:title', content: metadata.title },
      { property: 'og:description', content: metadata.description },
      { property: 'og:type', content: metadata.type ?? 'website' },
    ],
  };
}
