import type { MetadataProxyContext } from './start-metadata-support';

export function metadataTarget(context: MetadataProxyContext): string {
  const url = new URL(context.request.url);

  const resumeMatch = url.pathname.match(/^\/resume-(en|pt-BR)\.pdf$/);

  const configured =
    process.env.PORTFOLIO_CONTENT_API_URL ?? 'http://laravel:8000/api/v1/public-site';

  const laravelBase = configured.replace(/\/api\/v1\/public-site\/?$/, '');

  return resumeMatch
    ? `${laravelBase}/api/v1/resume/${resumeMatch[1]}.pdf`
    : `${laravelBase}${url.pathname}${url.search}`;
}
