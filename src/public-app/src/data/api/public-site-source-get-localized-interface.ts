import type { InterfaceMessages } from '../domain/types.ts';
import { getSnapshot } from './public-site-source-get-snapshot';

export async function getLocalizedInterface(locale?: string): Promise<InterfaceMessages> {
  return (await getSnapshot(locale)).interface;
}
