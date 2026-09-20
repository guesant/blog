import type { SiteText } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { optionalStringValue } from './public-site-source-optional-string-value';

export function siteBuild(value: RecordValue | undefined): SiteText['build'] {
  return { commitSha: optionalStringValue(value?.commit_sha) };
}
