import type { Reference } from '@portfolio/data/domain/types';

export function findingTopics(item: Reference) {
  return item.topics.map((name, index) => ({
    name,
    slug: item.topicSlugs?.[index],
    url: item.topicUrls?.[index],
  }));
}
