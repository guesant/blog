import { TopicoDetailContent } from '../../sections/topic-detail';
import type { RouteRendererProps } from './route-renderers.types';

type TopicDetailRouteRendererProps = RouteRendererProps;

export function TopicDetailRouteRenderer(props: TopicDetailRouteRendererProps) {
  if (props.data.kind !== 'topic-detail') {
    return null;
  }

  return (
    <TopicoDetailContent
      topic={props.data.topic}
      references={props.data.references}
      pagination={props.data.pagination}
    />
  );
}
