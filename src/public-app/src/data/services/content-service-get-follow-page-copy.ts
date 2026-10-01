import { getLocalizedPage } from '../api/public-site-source.ts';
import { stringValue } from '../api/public-site-source-string-value';

export async function getFollowPageCopy(locale?: string) {
  const page = await getLocalizedPage<Record<string, unknown>>('follow', locale);

  const entries = Array.isArray(page.entries) ? page.entries : [];

  const futureEntries = Array.isArray(page.future_entries) ? page.future_entries : [];

  return {
    ...page,
    title: stringValue(page.title),
    description: stringValue(page.intro),
    intro: stringValue(page.intro),
    sectionLabel: stringValue(page.sectionLabel),
    sectionTitle: stringValue(page.sectionTitle),
    futureLabel: stringValue(page.futureLabel),
    futureTitle: stringValue(page.futureTitle),
    plannedLabel: stringValue(page.plannedLabel),
    entries,
    futureEntries,
  } as import('../domain/types.ts').FollowPageCopy;
}
