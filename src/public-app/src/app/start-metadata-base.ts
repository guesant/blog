const configuredMetadataApiUrl = process.env.PORTFOLIO_CONTENT_API_URL ?? 'http://laravel:8000';

export function metadataLaravelBase(): string {
  return configuredMetadataApiUrl.replace(/\/api\/v1(?:\/(?:public-site|site\/chrome))?\/?$/, '');
}
