import type { SiteRouteHeadValues } from './site-route-head-values';

export function siteRouteHeadLinks(values: SiteRouteHeadValues) {
  return [
    { rel: 'canonical', href: values.canonicalUrl },
    { rel: 'alternate', hrefLang: 'en', href: values.englishUrl },
    { rel: 'alternate', hrefLang: 'pt-BR', href: values.portugueseUrl },
    { rel: 'alternate', hrefLang: 'x-default', href: values.englishUrl },
  ];
}
