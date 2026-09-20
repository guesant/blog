import { PageLayout } from './components/layouts/page-layout';
import type { RouteData } from './data/queries';
import { routeRenderers } from './components/content/route-renderers';

type RouteViewProps = { data: RouteData };

export function RouteView(props: RouteViewProps) {
  return <PageLayout children={routeRenderers[props.data.kind]?.(props.data) ?? null} />;
}
