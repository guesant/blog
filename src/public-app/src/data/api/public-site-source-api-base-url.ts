export function apiBaseUrl(): string {
  const configured = globalThis.process?.env.PORTFOLIO_CONTENT_API_URL;

  return (configured ?? '/api/v1').replace(/\/public-site\/?$/, '');
}
