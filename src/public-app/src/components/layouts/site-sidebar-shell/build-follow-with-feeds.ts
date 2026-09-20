import type { NavigationItem } from '@portfolio/data/domain/types';

type BuildFollowWithFeedsProps = {
  item: NavigationItem;
  locale: string;
};

export function buildFollowWithFeeds(props: BuildFollowWithFeedsProps): NavigationItem {
  const feedPrefix = props.locale === 'pt-BR' ? '/pt-BR' : '';

  return {
    ...props.item,
    children:
      props.item.children.length > 0
        ? props.item.children
        : [
            { route: `${feedPrefix}/feed.xml`, label: 'rss', children: [] },
            { route: `${feedPrefix}/feed.json`, label: 'feed', children: [] },
          ],
  };
}
