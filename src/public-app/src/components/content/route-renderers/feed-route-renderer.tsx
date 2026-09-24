import { FeedRouteSection } from '../feed-route-section';
import { createRouteRenderer } from './create-route-renderer';

export const FeedRouteRenderer = createRouteRenderer({
  kind: 'feed',
  render: (data) => <FeedRouteSection data={data} />,
});
