import type { SidebarGroup, SiteText } from '../domain/types.ts';
import type { RecordValue } from './public-site-source-support';
import { navigationItem } from './public-site-source-navigation-item';
import { objectValue } from './public-site-source-object-value';
import { recordList } from './public-site-source-list';
import { stringValue } from './public-site-source-string-value';

export function siteNavigation(value: unknown): SiteText['navigation'] {
  const navigation = objectValue(value);

  return {
    sidebar: recordList<unknown>(navigation?.sidebar).flatMap((group, index): SidebarGroup[] => {
      if (Array.isArray(group)) {
        return [
          {
            key: `legacy-${index}`,
            items: group.map((item) => navigationItem(item as RecordValue)),
          },
        ];
      }

      const record = objectValue(group);

      return [
        {
          key: stringValue(record?.key),
          label: stringValue(record?.label),
          items: recordList<RecordValue>(record?.items).map(navigationItem),
        },
      ];
    }),
    footerLinks: recordList<RecordValue>(navigation?.footer_links).map(navigationItem),
    sitemap: recordList<RecordValue>(navigation?.sitemap).map(navigationItem),
  };
}
