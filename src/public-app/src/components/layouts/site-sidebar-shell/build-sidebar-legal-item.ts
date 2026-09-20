import type { NavigationItem } from '@portfolio/data/domain/types';
import { navigationItem } from './navigation-item';

type BuildSidebarLegalItemProps = {
  visible: boolean;
  route: string;
  label: string;
};

export function buildSidebarLegalItem(
  props: BuildSidebarLegalItemProps,
): NavigationItem | undefined {
  return props.visible ? navigationItem(props.route, props.label) : undefined;
}
