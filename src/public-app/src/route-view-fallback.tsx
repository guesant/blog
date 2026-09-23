import type { RouteData } from './data/queries';
import type { ReactNode } from 'react';
import { PreviousRoute } from './components/content/route-renderers/previous-route';
import { RouteRendererFallback } from './components/content/route-renderers/route-renderer-fallback';

type RouteViewFallbackProps = {
  kind: RouteData['kind'];
  previousRoute?: ReactNode;
};

export function RouteViewFallback(props: RouteViewFallbackProps) {
  if (props.previousRoute) {
    return <PreviousRoute content={props.previousRoute} />;
  }

  return <RouteRendererFallback kind={props.kind} />;
}
