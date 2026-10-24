import { TopicoDetailContent } from '../../sections/topic-detail';
import { createRouteRenderer } from './create-route-renderer';

export const TopicDetailRouteRenderer = createRouteRenderer({
  kind: 'topic-detail',
  render: (data) => <TopicoDetailContent topic={data.topic} pagination={data.pagination} />,
});
