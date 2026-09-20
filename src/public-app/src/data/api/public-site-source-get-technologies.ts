import type { Technology } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { getSnapshot } from './public-site-source-get-snapshot';
import { stringValue } from './public-site-source-string-value';
import { recordList } from './public-site-source-list';

export async function getTechnologies(locale?: string): Promise<Technology[]> {
  const snapshot = await getSnapshot(locale);

  return recordList<RecordValue>(snapshot.technologies).map((technology) => ({
    slug: stringValue(technology.slug),
    name: stringValue(technology.name ?? technology.slug),
    code: stringValue(technology.code),
    url: stringValue(technology.url),
    skills: recordList<unknown>(technology.skills).map(stringValue),
  }));
}
