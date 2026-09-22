import type { InterfaceMessages } from '../domain/types.ts';
import { getSiteInterface } from './public-site-generated-client';
import { apiClient } from './public-site-source-api-client';

export async function getLocalizedInterface(locale?: string): Promise<InterfaceMessages> {
  const result = await getSiteInterface({ client: apiClient(), query: { locale } });

  return (result.data ?? {}) as InterfaceMessages;
}
