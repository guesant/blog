import type { ExternalProfile } from '@portfolio/data/domain/types';
import type { ExternalProfilesTranslator } from '@/i18n/compat-support';
import { trimmedLabel } from './trimmed-label';

type TranslateProfileLabel = ExternalProfilesTranslator;

export function externalProfileLabel(profile: ExternalProfile, t: TranslateProfileLabel): string {
  const label = trimmedLabel(profile.label);

  if (profile.platform === 'other') {
    return label || profile.url;
  }
  return label || t(profile.platform);
}
