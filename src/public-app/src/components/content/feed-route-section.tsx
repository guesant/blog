import { useTranslations } from '@/i18n/compat';
import type { RouteData } from '../../data/queries';
import { ContentFeed } from './content-feed';

type FeedRouteSectionProps = {
  data: Extract<RouteData, { kind: 'feed' }>;
};

export function FeedRouteSection(props: FeedRouteSectionProps) {
  const t = useTranslations('Pages.feed');

  const tNav = useTranslations('Nav');

  return (
    <ContentFeed
      feedItems={props.data.feedItems}
      writings={[]}
      findings={[]}
      collections={[]}
      copy={{ title: t('title'), description: t('description') }}
      breadcrumbs={[{ label: tNav('feed') }]}
      contentMeta={props.data.feedPagination}
      action="/feed"
      displayControls
      initialPerPage={10}
    />
  );
}
