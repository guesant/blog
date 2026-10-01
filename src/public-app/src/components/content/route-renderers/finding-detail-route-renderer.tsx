import { FindingDetailPage } from '../../sections/finding-detail';
import { createRouteRenderer } from './create-route-renderer';

export const FindingDetailRouteRenderer = createRouteRenderer({
  kind: 'finding-detail',
  render: (data) => <FindingDetailPage item={data.item} />,
});
