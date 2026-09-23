import { ContentFeedRouteSection } from '../content-feed-route-section';
import { createRouteRenderer } from './create-route-renderer';

export const WritingRouteRenderer = createRouteRenderer({
  kind: 'writing',
  render: (data) => <ContentFeedRouteSection data={data} fixedKind="post" action="/writing" />,
});
