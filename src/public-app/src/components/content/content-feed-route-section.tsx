import type { RouteData } from '../../data/queries';
import { useTranslations } from '@/i18n/compat';
import { ContentFeed } from './content-feed';
import type { ContentFeedProps } from './content-feed/types';

type ContentFeedRouteKind = 'collections' | 'findings' | 'writing';

type ContentFeedRouteData = Extract<RouteData, { kind: ContentFeedRouteKind }>;

type ContentFeedRouteSectionProps = {
  data: ContentFeedRouteData;
  fixedKind: 'post' | 'achado' | 'colecao';
  action: string;
};

export function ContentFeedRouteSection(props: ContentFeedRouteSectionProps) {
  const tNav = useTranslations('Nav');

  const tFeed = useTranslations('Pages.feed');

  const tWritings = useTranslations('Pages.writings');

  const breadcrumbLabels: Record<ContentFeedRouteSectionProps['fixedKind'], string> = {
    post: tNav('writing'),
    achado: tNav('findings'),
    colecao: tNav('collections'),
  };

  const feedProps: ContentFeedProps = {
    feedItems: props.data.feedItems,
    copy: props.data.page,
    searchPlaceholder:
      props.fixedKind === 'post' ? tWritings('searchPlaceholder') : tFeed('searchPlaceholder'),
    breadcrumbs: [{ label: breadcrumbLabels[props.fixedKind] }],
    contentMeta: props.data.feedPagination,
    findingFacets: props.data.feedPagination.facets,
    fixedKind: props.fixedKind,
    action: props.action,
  };

  return <ContentFeed {...feedProps} />;
}
