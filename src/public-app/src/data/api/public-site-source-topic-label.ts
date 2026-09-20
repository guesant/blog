import { RecordValue } from './public-site-source-support';
import { firstText } from './public-site-source-first-text';

export function topicLabel(topic: RecordValue): string {
  return firstText(topic.name, topic.slug);
}
