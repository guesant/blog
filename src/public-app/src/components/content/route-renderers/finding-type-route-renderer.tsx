import { TipoDetailContent } from '../../sections/finding-type';
import type { RouteRendererProps } from './route-renderers.types';

type FindingTypeRouteRendererProps = RouteRendererProps;

export function FindingTypeRouteRenderer(props: FindingTypeRouteRendererProps) {
  if (props.data.kind !== 'finding-type') {
    return null;
  }

  return (
    <TipoDetailContent
      tipo={props.data.type}
      references={props.data.references}
      pagination={props.data.pagination}
    />
  );
}
