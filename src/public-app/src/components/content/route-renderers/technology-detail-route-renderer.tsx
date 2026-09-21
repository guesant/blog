import { TechnologyDetailPageContent } from '../../sections/technologies';
import type { RouteRendererProps } from './route-renderers.types';

type TechnologyDetailRouteRendererProps = RouteRendererProps;

export function TechnologyDetailRouteRenderer(props: TechnologyDetailRouteRendererProps) {
  if (props.data.kind !== 'technology-detail') {
    return null;
  }

  return <TechnologyDetailPageContent technology={props.data.technology} />;
}
