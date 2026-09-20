import type { MetadataProxyContext, MetadataProxyResult } from './start-metadata-support';

export async function metadataResponse<T extends MetadataProxyContext>(
  context: T,
  target: string,
): Promise<MetadataProxyResult<T>> {
  try {
    const response = await fetch(target, {
      headers: { accept: context.request.headers.get('accept') ?? '*/*' },
    });

    const headers = new Headers(response.headers);

    headers.delete('content-encoding');
    headers.delete('content-length');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } catch {
    return (await context.next()) as MetadataProxyResult<T>;
  }
}
