import { FindingsSection } from '../../sections/findings';
import type { RouteRendererProps } from './route-renderers.types';

type FindingsRouteRendererProps = RouteRendererProps;

export function FindingsRouteRenderer(props: FindingsRouteRendererProps) {
  if (props.data.kind !== 'findings') {
    return null;
  }

  return <FindingsSection copy={props.data.page} {...props.data.request} />;
}
