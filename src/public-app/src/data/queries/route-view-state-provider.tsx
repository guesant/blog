import { useRef, type ReactNode } from 'react';
import { routeViewStateContext, type RouteViewState } from './route-view-state-context';

type RouteViewStateProviderProps = { children: ReactNode };

export function RouteViewStateProvider(props: RouteViewStateProviderProps) {
  const state = useRef<RouteViewState>({}).current;

  return (
    <routeViewStateContext.Provider value={state}>{props.children}</routeViewStateContext.Provider>
  );
}
