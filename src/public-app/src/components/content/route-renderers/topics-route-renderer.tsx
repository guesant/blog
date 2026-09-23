import { TopicosPageContent } from '../../sections/topics';
import { createRouteRenderer } from './create-route-renderer';

export const TopicsRouteRenderer = createRouteRenderer({
  kind: 'topics',
  render: (data) => <TopicosPageContent topics={data.topics} pagination={data.pagination} />,
});
