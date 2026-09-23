import type { ReactNode } from 'react';
import { LoadingPage } from '../../sections/loading';
import type { RouteData } from '../../../data/queries';

export const routeRendererFallbacks: Partial<Record<RouteData['kind'], ReactNode>> = {
  loading: <LoadingPage />,
};
