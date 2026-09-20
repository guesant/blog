import type { Snippet } from '../domain/types.ts';
import { getSnapshot } from './public-site-source-get-snapshot';
import { snippet } from './public-site-source-snippet';
import { recordList } from './public-site-source-list';
import type { RecordValue } from './public-site-source-support';

export async function getSnippets(locale?: string): Promise<Snippet[]> {
  return recordList<RecordValue>((await getSnapshot(locale)).snippets).map(snippet);
}
