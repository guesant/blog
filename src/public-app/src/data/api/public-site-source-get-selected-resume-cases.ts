import type { CaseStudy } from '../domain/types.ts';
import { getSiteResume } from './public-site-generated-client';
import { apiClient } from './public-site-source-api-client';
import { entity } from './public-site-source-entity';
import { recordList } from './public-site-source-list';
import type { RecordValue } from './public-site-source-support';
import { objectValue } from './public-site-source-object-value';

export async function getSelectedResumeCases(locale?: string): Promise<CaseStudy[]> {
  const result = await getSiteResume({
    client: apiClient(),
    throwOnError: true,
    query: { locale },
  });

  const resume = objectValue(result.data) ?? {};

  return recordList<RecordValue>(resume.selected_cases).map(
    (item) => entity('cases', item) as CaseStudy,
  );
}
