import { NowPageContent } from '../../sections/now';
import { createRouteRenderer } from './create-route-renderer';

export const NowRouteRenderer = createRouteRenderer({
  kind: 'now',
  render: (data) => <NowPageContent page={data.page} />,
});
