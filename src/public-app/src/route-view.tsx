import { createElement, Suspense, useEffect } from 'react';
import { PageLayout } from './components/layouts/page-layout';
import type { RouteData } from './data/queries';
import { routeRenderers } from './components/content/route-renderers';
import { RouteViewFallback } from './route-view-fallback';
import { useRouteViewState } from './data/queries/use-route-view-state';

type RouteViewProps = { data: RouteData };

export function RouteView(props: RouteViewProps) {
  const Renderer = routeRenderers[props.data.kind];

  const routeState = useRouteViewState();

  useEffect(() => {
    if (routeState) {
      routeState.previousRoute = createElement(Renderer, { data: props.data });
    }
  }, [Renderer, props.data, routeState]);

  const fallback = (
    <RouteViewFallback kind={props.data.kind} previousRoute={routeState?.previousRoute} />
  );

  return (
    <PageLayout
      visualVariant={props.data.kind === 'about' ? 'aboutPageLayout' : 'pageLayout'}
      children={
        <Suspense fallback={fallback}>
          <Renderer data={props.data} />
        </Suspense>
      }
    />
  );
}
