'use client';

import { Icon, type IconName } from '../../primitives/icon';
import { NavLink } from '../../primitives/nav-link';
import { ExplorationButton } from '../../ui/semantic/ExplorationButton';

type ExploreTileProps = { tile: { icon: IconName; label: string; href: string } };

export function ExploreTile(props: ExploreTileProps) {
  const { tile } = props;

  return (
    <ExplorationButton
      component={NavLink}
      href={tile.href}

      startIcon={<Icon name={tile.icon} size={16} />}
    >
      {tile.label}
    </ExplorationButton>
  );
}
