import { useContext } from 'react';
import { routeViewStateContext } from './route-view-state-context';

export function useRouteViewState() {
  return useContext(routeViewStateContext);
}
