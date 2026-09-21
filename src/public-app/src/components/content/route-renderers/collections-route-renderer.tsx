import { CollectionsSection } from '../../sections/collections';
import type { RouteRendererProps } from './route-renderers.types';

type CollectionsRouteRendererProps = RouteRendererProps;

export function CollectionsRouteRenderer(props: CollectionsRouteRendererProps) {
  if (props.data.kind !== 'collections') {
    return null;
  }

  return (
    <CollectionsSection
      writings={props.data.writings}
      findings={props.data.findings}
      collections={props.data.collections}
      copy={props.data.page}
      contentMeta={props.data.pagination}
    />
  );
}
