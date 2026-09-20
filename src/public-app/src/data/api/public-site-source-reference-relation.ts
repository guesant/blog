import type { ReferenceRelation } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { optionalStringValue } from './public-site-source-optional-string-value';
import { stringValue } from './public-site-source-string-value';
import { firstValue } from './public-site-source-first-value';

export function referenceRelation(relation: RecordValue): ReferenceRelation {
  return {
    relationType: stringValue(firstValue(relation.relationType, relation.relation_type)),
    family: optionalStringValue(relation.family),
    direction: relation.direction === 'inbound' ? 'inbound' : 'outbound',
    label: stringValue(relation.label),
    targetKind: optionalStringValue(firstValue(relation.targetKind, relation.target_kind)),
    targetSlug: stringValue(firstValue(relation.targetSlug, relation.target_slug)),
    targetTitle: stringValue(firstValue(relation.targetTitle, relation.target_title)),
    targetUrl: optionalStringValue(firstValue(relation.targetUrl, relation.target_url)),
    note: optionalStringValue(relation.note),
    context: optionalStringValue(relation.context),
    status: stringValue(relation.status),
  };
}
