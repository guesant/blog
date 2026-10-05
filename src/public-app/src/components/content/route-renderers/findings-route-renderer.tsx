import { ContentFeedRouteSection } from '../content-feed-route-section';
import { createRouteRenderer } from './create-route-renderer';

export const FindingsRouteRenderer = createRouteRenderer({
  kind: 'findings',
  render: (data) => <ContentFeedRouteSection data={data} fixedKind="achado" action="/findings" />,
});
