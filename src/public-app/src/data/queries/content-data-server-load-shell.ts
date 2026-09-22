import {
  getInterfaceMessages,
  getNavigationAvailability,
  getProfile,
  getSiteText,
} from '@portfolio/data/services';
import type { ShellData } from './content-data-support';

export async function loadShellData(locale: string): Promise<ShellData> {
  const [profile, site, availability, messages] = await Promise.all([
    getProfile(locale),
    getSiteText(locale),
    getNavigationAvailability(locale),
    getInterfaceMessages(locale),
  ]);

  return { profile, site, availability, messages };
}
