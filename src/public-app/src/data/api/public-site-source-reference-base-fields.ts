import type { Reference } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { optionalStringValue } from './public-site-source-optional-string-value';
import { stringValue } from './public-site-source-string-value';
import { firstValue } from './public-site-source-first-value';

type ReferenceBaseFields = Pick<
  Reference,
  | 'slug'
  | 'url'
  | 'type'
  | 'authors'
  | 'organizations'
  | 'publishedDateISO'
  | 'foundDateISO'
  | 'image'
  | 'consumptionState'
  | 'rating'
  | 'title'
  | 'alternativeTitle'
  | 'description'
  | 'personalNote'
  | 'reasonFound'
>;

export function referenceBaseFields(item: RecordValue): ReferenceBaseFields {
  return {
    slug: stringValue(item.slug),
    url: optionalStringValue(item.url),
    type: stringValue(item.type),
    authors: stringValue(item.authors),
    organizations: stringValue(item.organizations),
    publishedDateISO: stringValue(item.published_date),
    foundDateISO: stringValue(item.found_date),
    image: optionalStringValue(item.image),
    consumptionState: stringValue(item.consumption_state),
    rating: stringValue(item.rating),
    title: stringValue(firstValue(item.title, item.slug)),
    alternativeTitle: stringValue(item.alternative_title),
    description: stringValue(item.description),
    personalNote: stringValue(item.personal_note),
    reasonFound: stringValue(item.reason_found),
  };
}
