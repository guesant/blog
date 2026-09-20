import type { NavigationItem } from '@portfolio/data/domain/types';

export function navigationItem(route: string, label: string): NavigationItem {
  return { route, label, children: [] };
}
