import { FollowPageContent } from '../../sections/follow';
import { createRouteRenderer } from './create-route-renderer';

export const FollowRouteRenderer = createRouteRenderer({
  kind: 'follow',
  render: (data) => <FollowPageContent page={data.page} />,
});
