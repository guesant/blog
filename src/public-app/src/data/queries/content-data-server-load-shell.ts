import { getLocalizedShell } from '../api/public-site-source-get-localized-shell';
import type { ShellData } from './content-data-support';

export async function loadShellData(locale: string): Promise<ShellData> {
  const { profile, site, availability } = await getLocalizedShell(locale);

  return { profile, site, availability };
}
