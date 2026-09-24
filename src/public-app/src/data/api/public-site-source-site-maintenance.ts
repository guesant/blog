import type { SiteText } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { stringValue } from './public-site-source-string-value';

export function siteMaintenance(site: RecordValue): SiteText['maintenance'] {
  return {
    title: stringValue(site.maintenance_title),
    description: stringValue(site.maintenance_description),
  };
}
