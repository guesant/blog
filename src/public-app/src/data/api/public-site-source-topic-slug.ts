import { RecordValue } from './public-site-source-support';
import { textValue } from './public-site-source-text-value';

export function topicSlug(topic: RecordValue): string {
  return textValue(topic.slug);
}
