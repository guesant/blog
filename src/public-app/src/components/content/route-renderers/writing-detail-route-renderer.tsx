import { WritingDetailContent } from '../../sections/writing-detail';
import { createRouteRenderer } from './create-route-renderer';

export const WritingDetailRouteRenderer = createRouteRenderer({
  kind: 'writing-detail',
  render: (data) => <WritingDetailContent item={data.item} />,
});
