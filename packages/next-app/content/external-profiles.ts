import type { ExternalProfile } from '@portfolio/content/types';

type TranslateProfileLabel = (key: string) => string;

export function externalProfileLabel(profile: ExternalProfile, t: TranslateProfileLabel): string {
  if (profile.platform === 'other') {
    return profile.label?.trim() || profile.url;
  }
  return profile.label?.trim() || t(profile.platform);
}
