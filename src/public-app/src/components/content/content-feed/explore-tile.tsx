'use client';

import { Button } from '../../ui';
import { Icon, type IconName } from '../../primitives/icon';
import { NavLink } from '../../primitives/nav-link';

type ExploreTileProps = { tile: { icon: IconName; label: string; href: string } };

export function ExploreTile(props: ExploreTileProps) {
  const { tile } = props;

  return (
    <Button
      component={NavLink}
      href={tile.href}
      siteVariant="exploration"
      startIcon={<Icon name={tile.icon} size={16} />}
    >
      {tile.label}
    </Button>
  );
}
