import { recordList } from './public-site-source-list';
import { stringValue } from './public-site-source-string-value';
import type { RecordValue } from './public-site-source-support';

export function technologyFields(item: RecordValue): RecordValue {
  return {
    technologies: recordList<RecordValue>(item.technologies).map((technology) =>
      stringValue(technology.name),
    ),
    technologySlugs: recordList<RecordValue>(item.technologies).map((technology) =>
      stringValue(technology.slug),
    ),
  };
}
