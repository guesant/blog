import { FollowPageContent } from '../../sections/follow';
import type { RouteRendererProps } from './route-renderers.types';

type FollowRouteRendererProps = RouteRendererProps;

export function FollowRouteRenderer(props: FollowRouteRendererProps) {
  if (props.data.kind !== 'follow') {
    return null;
  }

  return <FollowPageContent page={props.data.page} />;
}
