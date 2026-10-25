import type { MetadataProxyContext } from './start-metadata-support';
import { metadataPaths } from './start-metadata-support';

export function isMetadataRequest(context: MetadataProxyContext): boolean {
  const { handlerType, request } = context;

  return (
    handlerType === 'router' &&
    request.method === 'GET' &&
    metadataPaths.has(new URL(request.url).pathname)
  );
}
