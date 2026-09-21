import { TopicosPageContent } from '../../sections/topics';
import type { RouteRendererProps } from './route-renderers.types';

type TopicsRouteRendererProps = RouteRendererProps;

export function TopicsRouteRenderer(props: TopicsRouteRendererProps) {
  if (props.data.kind !== 'topics') {
    return null;
  }

  return <TopicosPageContent topics={props.data.topics} pagination={props.data.pagination} />;
}
