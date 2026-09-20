import type { ReactNode } from 'react';
import { Card } from '../ui';
import { NavLink } from '../primitives/nav-link';

type CatalogCardProps = {
  children: ReactNode;
  href?: string;
};

export function CatalogCard(props: CatalogCardProps) {
  const linkProps = props.href ? { component: NavLink, href: props.href } : {};

  return (
    <Card {...linkProps} variant="outlined" visualVariant="catalogEntry">
      {props.children}
    </Card>
  );
}
