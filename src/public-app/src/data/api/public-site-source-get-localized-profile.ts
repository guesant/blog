import type { Profile } from '../domain/types.ts';
import { textValue } from './public-site-source-text-value';
import { listValue } from './public-site-source-list-value';
import { objectValue } from './public-site-source-object-value';
import { getLocalizedSiteChrome } from './public-site-source-get-localized-site-chrome';
import type { RecordValue } from './public-site-source-support';

export async function getLocalizedProfile(locale?: string, chrome?: RecordValue): Promise<Profile> {
  const result = chrome ?? (await getLocalizedSiteChrome(locale));

  const profile = objectValue(result.profile) ?? {};

  return {
    name: textValue(profile.name),
    birthDate: textValue(profile.birth_date),
    title: textValue(profile.title),
    location: textValue(profile.location),
    birthCity: textValue(profile.birth_city),
    description: textValue(profile.description),
    interests: textValue(profile.interests),
    learning: textValue(profile.learning),
    personalInterests: listValue<RecordValue>(profile.personal_interests).map((item) =>
      textValue(item.value),
    ),
    trajectory: listValue<Profile['trajectory'][number]>(profile.trajectory),
    milestones: listValue<Profile['milestones'][number]>(profile.milestones),
  };
}
