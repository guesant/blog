import { Suspense } from 'react';
import { PageLayout } from './components/layouts/page-layout';
import type { RouteData } from './data/queries';
import { routeRenderers } from './components/content/route-renderers';

type RouteViewProps = { data: RouteData };

export function RouteView(props: RouteViewProps) {
  const Renderer = routeRenderers[props.data.kind];

  return (
    <PageLayout
      children={
        <Suspense fallback={null}>
          <Renderer data={props.data} />
        </Suspense>
      }
    />
  );
}
