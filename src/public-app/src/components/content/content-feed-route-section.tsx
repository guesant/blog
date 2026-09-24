import type { RouteData } from '../../data/queries';
import { useTranslations } from '@/i18n/compat';
import { ContentFeed } from './content-feed';
import type { ContentFeedProps } from './content-feed/types';

type ContentFeedRouteData = Extract<RouteData, { kind: 'collections' | 'writing' }>;

type ContentFeedRouteSectionProps = {
  data: ContentFeedRouteData;
  fixedKind: 'post' | 'colecao';
  action: string;
};

export function ContentFeedRouteSection(props: ContentFeedRouteSectionProps) {
  const tNav = useTranslations('Nav');

  const breadcrumbLabels = {
    post: tNav('writing'),
    colecao: tNav('collections'),
  };

  const feedProps: ContentFeedProps = {
    writings: props.data.writings,
    findings: props.data.findings,
    collections: props.data.collections,
    copy: props.data.page,
    breadcrumbs: [{ label: breadcrumbLabels[props.fixedKind] }],
    contentMeta: props.data.pagination,
    fixedKind: props.fixedKind,
    action: props.action,
  };

  return <ContentFeed {...feedProps} />;
}
