import { createClient } from './generated/client/index.ts';
import { apiBaseUrl } from './public-site-source-api-base-url';

export function apiClient() {
  return createClient({ baseUrl: apiBaseUrl() });
}
