import type { ExternalProfile } from '@portfolio/data/domain/types';
import { trimmedLabel } from './trimmed-label';

type TranslateProfileLabel = (key: string) => string;

export function externalProfileLabel(profile: ExternalProfile, t: TranslateProfileLabel): string {
  const label = trimmedLabel(profile.label);

  if (profile.platform === 'other') {
    return label || profile.url;
  }
  return label || t(profile.platform);
}
