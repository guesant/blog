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
    sectionLabel: stringValue(page.section_label),
    sectionTitle: stringValue(page.section_title),
    futureLabel: stringValue(page.future_label),
    futureTitle: stringValue(page.future_title),
    plannedLabel: stringValue(page.planned_label),
    entries,
    futureEntries,
  } as import('../domain/types.ts').FollowPageCopy;
}
