import { HomeSection } from '../../sections/home';
import type { RouteRendererProps } from './route-renderers.types';

type HomeRouteRendererProps = RouteRendererProps;

export function HomeRouteRenderer(props: HomeRouteRendererProps) {
  if (props.data.kind !== 'home') {
    return null;
  }

  return (
    <HomeSection
      content={props.data.content}
      writings={props.data.writings}
      findings={props.data.findings}
      collections={props.data.collections}
      feedPagination={props.data.feedPagination}
    />
  );
}
