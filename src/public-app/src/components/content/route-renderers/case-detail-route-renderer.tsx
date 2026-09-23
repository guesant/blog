import { CaseDetailContent } from '../../sections/case-detail';
import { createRouteRenderer } from './create-route-renderer';

export const CaseDetailRouteRenderer = createRouteRenderer({
  kind: 'case-detail',
  render: (data) => <CaseDetailContent item={data.item} />,
});
