import { getLocalizedProfile } from '../api/public-site-source.ts';
import type { Profile } from '../domain/types.ts';

export async function getProfile(locale?: string): Promise<Profile> {
  return getLocalizedProfile(locale);
}
