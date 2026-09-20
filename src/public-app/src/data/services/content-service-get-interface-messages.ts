import { getLocalizedInterface } from '../api/public-site-source.ts';
import type { InterfaceMessages } from '../domain/types.ts';

export async function getInterfaceMessages(locale?: string): Promise<InterfaceMessages> {
  return getLocalizedInterface(locale);
}
