import { isMetadataRequest } from './start-metadata-eligibility';
import { metadataResponse } from './start-metadata-response';
import { metadataTarget } from './start-metadata-target';
import type { MetadataProxyContext, MetadataProxyResult } from './start-metadata-support';

export async function metadataProxyHandler<T extends MetadataProxyContext>(
  context: T,
): Promise<MetadataProxyResult<T>> {
  if (!isMetadataRequest(context)) {
    return (await context.next()) as MetadataProxyResult<T>;
  }
  return metadataResponse(context, metadataTarget(context));
}
