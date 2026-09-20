import type { Snippet } from '../domain/types.ts';
import { RecordValue } from './public-site-source-support';
import { stringValue } from './public-site-source-string-value';
import { optionalStringValue } from './public-site-source-optional-string-value';
import { recordList } from './public-site-source-list';

export function snippet(item: RecordValue): Snippet {
  return {
    slug: stringValue(item.slug),
    title: stringValue(item.title ?? item.slug),
    description: stringValue(item.description),
    publishedAt: optionalStringValue(item.published_at),
    url: stringValue(item.url),
    downloadUrl: stringValue(item.download_url),
    files: recordList<RecordValue>(item.files).map((file) => ({
      id: stringValue(file.id),
      path: stringValue(file.path),
      language: optionalStringValue(file.language),
      content: stringValue(file.content),
    })),
  };
}
