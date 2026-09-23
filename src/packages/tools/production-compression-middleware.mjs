export async function productionCompressionMiddleware(request, next) {
  const response = await next();
  const acceptedEncodings = request.headers.get('accept-encoding') ?? '';
  const encoding = acceptedEncodings.includes('gzip') ? 'gzip' : undefined;

  if (
    !encoding ||
    request.method === 'HEAD' ||
    !response.body ||
    response.headers.has('content-encoding')
  ) {
    return response;
  }

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('content-encoding', encoding);
  headers.set('vary', 'Accept-Encoding');

  return new Response(response.body.pipeThrough(new CompressionStream(encoding)), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
