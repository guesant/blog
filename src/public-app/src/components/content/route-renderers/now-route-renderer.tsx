import { NowPageContent } from '../../sections/now';
import type { RouteRendererProps } from './route-renderers.types';

type NowRouteRendererProps = RouteRendererProps;

export function NowRouteRenderer(props: NowRouteRendererProps) {
  if (props.data.kind !== 'now') {
    return null;
  }

  return <NowPageContent page={props.data.page} />;
}
