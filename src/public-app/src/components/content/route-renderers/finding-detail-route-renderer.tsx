import { AchadoDetailContent } from '../../sections/finding-detail';
import { createRouteRenderer } from './create-route-renderer';

export const FindingDetailRouteRenderer = createRouteRenderer({
  kind: 'finding-detail',
  render: (data) => <AchadoDetailContent item={data.item} />,
});
