import type { Reference } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { referenceBaseFields } from './public-site-source-reference-base-fields';
import { referenceContentFields } from './public-site-source-reference-content-fields';
import { referenceTypeDetails } from './public-site-source-reference-type-details';

export function reference(item: RecordValue): Reference {
  return {
    hidden: false,
    order: 0,
    editorialState: '',
    visibility: 'public',
    ...referenceBaseFields(item),
    ...referenceContentFields(item),
    ...referenceTypeDetails(item),
  };
}
