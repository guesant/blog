import { createContext } from 'react';
import type { ReactNode } from 'react';
import type { RouteData } from './content-data-route-data';

export type RouteViewState = {
  previousData?: RouteData;
  previousRoute?: ReactNode;
};

export const routeViewStateContext = createContext<RouteViewState | undefined>(undefined);
