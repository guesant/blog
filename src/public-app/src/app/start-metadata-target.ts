import type { MetadataProxyContext } from './start-metadata-support';
import { metadataLaravelBase } from './start-metadata-base';
import { metadataResumeTarget } from './start-metadata-resume';

export function metadataTarget(context: MetadataProxyContext): string {
  const url = new URL(context.request.url);

  const laravelBase = metadataLaravelBase();

  const resumeTarget = metadataResumeTarget(url.pathname, laravelBase);

  return resumeTarget ?? `${laravelBase}${url.pathname}${url.search}`;
}
