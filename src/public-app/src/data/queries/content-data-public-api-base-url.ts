export function publicApiBaseUrl(): string {
  return (process.env.PORTFOLIO_PUBLIC_API_URL ?? '/api/v1').replace(/\/$/, '');
}
