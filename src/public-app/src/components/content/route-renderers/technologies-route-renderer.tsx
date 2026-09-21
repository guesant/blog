import { TechnologiesPageContent } from '../../sections/technologies';
import type { RouteRendererProps } from './route-renderers.types';

type TechnologiesRouteRendererProps = RouteRendererProps;

export function TechnologiesRouteRenderer(props: TechnologiesRouteRendererProps) {
  if (props.data.kind !== 'technologies') {
    return null;
  }

  return (
    <TechnologiesPageContent
      technologies={props.data.technologies}
      pagination={props.data.pagination}
    />
  );
}
