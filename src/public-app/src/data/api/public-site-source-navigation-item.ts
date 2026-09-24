import type { NavigationItem } from '../domain/types.ts';
import { RecordValue } from './public-site-source-support';
import { recordList } from './public-site-source-list';
import { stringValue } from './public-site-source-string-value';

export function navigationItem(item: RecordValue): NavigationItem {
  const route = stringValue(item.route);

  return {
    route,
    label: stringValue(item.label) || route.split('/').filter(Boolean).pop() || route,
    children: recordList<RecordValue>(item.children).map(navigationItem),
  };
}
