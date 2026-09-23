import type { ComponentType, ReactNode } from 'react';
import type { RouteData } from '../../../data/queries';
import type { RouteRendererProps } from './route-renderers.types';

type RouteRendererKind = RouteData['kind'];

type RouteRendererConfig<RouteKind extends RouteRendererKind> = {
  kind: RouteKind;
  render: (data: Extract<RouteData, { kind: RouteKind }>) => ReactNode;
};

export function createRouteRenderer<RouteKind extends RouteRendererKind>(
  config: RouteRendererConfig<RouteKind>,
): ComponentType<RouteRendererProps> {
  return (props: RouteRendererProps) => {
    if (props.data.kind !== config.kind) {
      return null;
    }

    return config.render(props.data as Extract<RouteData, { kind: RouteKind }>);
  };
}
