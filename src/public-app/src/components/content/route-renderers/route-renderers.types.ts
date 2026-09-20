import type { ReactNode } from 'react';
import type { RouteData } from '../../../data/queries';

export type RouteRenderer = (data: RouteData) => ReactNode;
