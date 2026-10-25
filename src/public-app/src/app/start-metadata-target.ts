import type { MetadataProxyContext } from './start-metadata-support';
import { metadataLaravelBase } from './start-metadata-base';

export function metadataTarget(context: MetadataProxyContext): string {
  const url = new URL(context.request.url);

  const laravelBase = metadataLaravelBase();

  return `${laravelBase}${url.pathname}${url.search}`;
}
