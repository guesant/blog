import { useTranslations } from '@/i18n/compat';
import type { RouteData } from '../../data/queries';
import { ContentFeed } from './content-feed';

type FeedRouteSectionProps = {
  data: Extract<RouteData, { kind: 'feed' }>;
};

export function FeedRouteSection(props: FeedRouteSectionProps) {
  const t = useTranslations('Pages.feed');

  return (
    <ContentFeed
      feedItems={props.data.feedItems}
      writings={[]}
      findings={[]}
      collections={[]}
      copy={{ title: t('title'), description: t('description') }}
      contentMeta={props.data.feedPagination}
      action="/feed"
      displayControls
      initialPerPage={10}
    />
  );
}
