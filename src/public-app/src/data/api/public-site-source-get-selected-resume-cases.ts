import type { CaseStudy } from '../domain/types.ts';
import { getSnapshot } from './public-site-source-get-snapshot';
import { entity } from './public-site-source-entity';
import { recordList } from './public-site-source-list';
import type { RecordValue } from './public-site-source-support';
import { objectValue } from './public-site-source-object-value';

export async function getSelectedResumeCases(locale?: string): Promise<CaseStudy[]> {
  const resume = objectValue((await getSnapshot(locale)).resume) ?? {};

  return recordList<RecordValue>(resume.selected_cases).map(
    (item) => entity('cases', item) as CaseStudy,
  );
}
