import type { Locale } from '../i18n/compat-support';
import type { RouteMetadata } from './_site/splat-support';
import { routeContext } from './site-route-context';
import { siteRouteCanonicalUrl } from './site-route-canonical-url';
import { siteRouteOrigin } from './site-route-origin';

export type SiteRouteHeadValues = {
  canonicalUrl: string;
  englishUrl: string;
  imageUrl: string;
  portugueseUrl: string;
};

export function siteRouteHeadValues(
  pathname: string,
  locale: Locale,
  metadata: RouteMetadata,
): SiteRouteHeadValues {
  const siteOrigin = siteRouteOrigin();

  const routePath = routeContext(pathname).pathname;

  const englishPath = routePath;

  const portuguesePath = routePath === '/' ? '/pt-BR' : `/pt-BR${routePath}`;

  const canonicalPath = locale === 'pt-BR' ? portuguesePath : englishPath;

  return {
    canonicalUrl: siteRouteCanonicalUrl(siteOrigin, canonicalPath),
    englishUrl: new URL(englishPath, siteOrigin).toString(),
    imageUrl: metadata.image ?? new URL('/favicon.svg', siteOrigin).toString(),
    portugueseUrl: new URL(portuguesePath, siteOrigin).toString(),
  };
}
