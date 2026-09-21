import { AchadoDetailContent } from '../../sections/finding-detail';
import type { RouteRendererProps } from './route-renderers.types';

type FindingDetailRouteRendererProps = RouteRendererProps;

export function FindingDetailRouteRenderer(props: FindingDetailRouteRendererProps) {
  if (props.data.kind !== 'finding-detail') {
    return null;
  }

  return <AchadoDetailContent item={props.data.item} />;
}
