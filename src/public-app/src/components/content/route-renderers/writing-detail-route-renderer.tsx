import { WritingDetailContent } from '../../sections/writing-detail';
import type { RouteRendererProps } from './route-renderers.types';

type WritingDetailRouteRendererProps = RouteRendererProps;

export function WritingDetailRouteRenderer(props: WritingDetailRouteRendererProps) {
  if (props.data.kind !== 'writing-detail') {
    return null;
  }

  return <WritingDetailContent item={props.data.item} />;
}
