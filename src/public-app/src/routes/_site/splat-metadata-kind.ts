import type { RouteData } from '../../data/queries';
import type { RouteMetadata } from './splat-support';

export function kindMetadata(data: RouteData): RouteMetadata {
  return { title: data.kind, description: data.kind };
}
