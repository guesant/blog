const headers = {
  'content-security-policy':
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:",
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  'cross-origin-opener-policy': 'same-origin',
};

export async function productionSecurityMiddleware(request, next) {
  const response = await next();
  const responseHeaders = new Headers(response.headers);

  for (const [name, value] of Object.entries(headers)) {
    if (!responseHeaders.has(name)) {
      responseHeaders.set(name, value);
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
