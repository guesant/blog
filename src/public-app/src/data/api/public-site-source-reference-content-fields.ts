import type { Reference } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { listValue } from './public-site-source-list-value';
import { referenceLink } from './public-site-source-reference-link';
import { referencePopularity } from './public-site-source-reference-popularity';
import { referenceRelation } from './public-site-source-reference-relation';
import { referenceRelations } from './public-site-source-reference-relations';
import { referenceIdentifiers } from './public-site-source-reference-identifiers';
import { topicLabel } from './public-site-source-topic-label';
import { topicSlug } from './public-site-source-topic-slug';
import { firstValue } from './public-site-source-first-value';
import { numberValue } from './public-site-source-number-value';

export function referenceContentFields(
  item: RecordValue,
): Pick<
  Reference,
  | 'topics'
  | 'topicSlugs'
  | 'links'
  | 'popularity'
  | 'featured'
  | 'featuredOrder'
  | 'identifiers'
  | 'relations'
> {
  return {
    topics: listValue<RecordValue>(item.topics).map(topicLabel),
    topicSlugs: listValue<RecordValue>(item.topics).map(topicSlug),
    links: listValue<RecordValue>(item.links).map(referenceLink),
    popularity: referencePopularity(item.popularity),
    featured: item.featured === true,
    featuredOrder: numberValue(item.featured_order),
    identifiers: referenceIdentifiers(item.identifiers),
    relations: referenceRelations(firstValue(item.relations, item.related)).map(referenceRelation),
  };
}
