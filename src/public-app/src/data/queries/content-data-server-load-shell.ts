import { getLocalizedShell } from '../api/public-site-source-get-localized-shell';
import { getInterfaceMessages } from '@portfolio/data/services';
import type { ShellData } from './content-data-support';

export async function loadShellData(locale: string): Promise<ShellData> {
  const [{ profile, site, availability }, messages] = await Promise.all([
    getLocalizedShell(locale),
    getInterfaceMessages(locale),
  ]);

  return { profile, site, availability, messages };
}
