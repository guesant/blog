import type { SiteText } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { navigationItem } from './public-site-source-navigation-item';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';

export function siteNavigation(value: unknown): SiteText['navigation'] {
  const navigation = objectValue(value);

  return {
    sidebar: recordList<RecordValue[]>(navigation?.sidebar).map((group) =>
      group.map(navigationItem),
    ),
    footerLinks: recordList<RecordValue>(navigation?.footer_links).map(navigationItem),
    sitemap: recordList<RecordValue>(navigation?.sitemap).map(navigationItem),
  };
}
