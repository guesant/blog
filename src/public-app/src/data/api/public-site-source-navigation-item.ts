import type { NavigationItem } from '../domain/types.ts';
import { RecordValue } from './public-site-source-support';
import { recordList } from './public-site-source-list';
import { stringValue } from './public-site-source-string-value';

export function navigationItem(item: RecordValue): NavigationItem {
  return {
    route: stringValue(item.route),
    label: stringValue(item.label),
    children: recordList<RecordValue>(item.children).map(navigationItem),
  };
}
