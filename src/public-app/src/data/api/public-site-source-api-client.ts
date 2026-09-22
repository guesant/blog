import { createClient } from './generated/client/index.ts';
import { apiBaseUrl } from './public-site-source-api-base-url';
import { fetchPublicApiWithTimeout } from './public-site-source-api-fetch';

export function apiClient() {
  return createClient({ baseUrl: apiBaseUrl(), fetch: fetchPublicApiWithTimeout });
}
