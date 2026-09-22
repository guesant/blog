import type { NavigationItem } from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';

type BuildFollowWithFeedsProps = {
  item: NavigationItem;
  locale: string;
  t: Translator;
};

export function buildFollowWithFeeds(props: BuildFollowWithFeedsProps): NavigationItem {
  const feedPrefix = props.locale === 'pt-BR' ? '/pt-BR' : '';

  return {
    ...props.item,
    children:
      props.item.children.length > 0
        ? props.item.children
        : [
            { route: `${feedPrefix}/feed.xml`, label: props.t('rss'), children: [] },
            { route: `${feedPrefix}/feed.json`, label: props.t('feed'), children: [] },
          ],
  };
}
