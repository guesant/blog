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
      feedItems={props.data.feedItems}
      feedPagination={props.data.feedPagination}
    />
  );
}
