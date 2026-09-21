import { ColecaoDetailContent } from '../../sections/collection-detail';
import type { RouteRendererProps } from './route-renderers.types';

type CollectionDetailRouteRendererProps = RouteRendererProps;

export function CollectionDetailRouteRenderer(props: CollectionDetailRouteRendererProps) {
  if (props.data.kind !== 'collection-detail') {
    return null;
  }

  return <ColecaoDetailContent collection={props.data.collection} />;
}
