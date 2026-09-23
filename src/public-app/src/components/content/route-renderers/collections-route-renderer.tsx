import { ContentFeedRouteSection } from '../content-feed-route-section';
import { createRouteRenderer } from './create-route-renderer';

export const CollectionsRouteRenderer = createRouteRenderer({
  kind: 'collections',
  render: (data) => (
    <ContentFeedRouteSection data={data} fixedKind="colecao" action="/collections" />
  ),
});
