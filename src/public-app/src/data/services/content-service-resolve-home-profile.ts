import type { HomePageContent, Profile } from '../domain/types.ts';
import { getLocalizedProfile } from '../api/public-site-source.ts';

export async function resolveHomeProfile(
  locale: string | undefined,
  shell: Pick<HomePageContent, 'profile'> | undefined,
): Promise<Profile> {
  if (shell?.profile) return shell.profile;

  return getLocalizedProfile(locale);
}
