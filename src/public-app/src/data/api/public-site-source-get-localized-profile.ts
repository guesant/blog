import type { Profile } from '../domain/types.ts';
import { getSnapshot } from './public-site-source-get-snapshot';
import { textValue } from './public-site-source-text-value';
import { listValue } from './public-site-source-list-value';
import { objectValue } from './public-site-source-object-value';

export async function getLocalizedProfile(locale?: string): Promise<Profile> {
  const profile = objectValue((await getSnapshot(locale)).chrome.profile) ?? {};

  return {
    name: textValue(profile.name),
    birthDate: textValue(profile.birth_date),
    title: textValue(profile.title),
    location: textValue(profile.location),
    birthCity: textValue(profile.birth_city),
    description: textValue(profile.description),
    interests: textValue(profile.interests),
    learning: textValue(profile.learning),
    personalInterests: listValue<string>(profile.personal_interests),
    trajectory: listValue<Profile['trajectory'][number]>(profile.trajectory),
    milestones: listValue<Profile['milestones'][number]>(profile.milestones),
  };
}
