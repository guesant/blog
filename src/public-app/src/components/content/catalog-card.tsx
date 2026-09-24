import type { ReactNode } from 'react';
import { Card, Link } from '../ui';
import { NavLink } from '../primitives/nav-link';

type CatalogCardProps = {
  children: ReactNode;
  href?: string;
};

export function CatalogCard(props: CatalogCardProps) {
  const isExternal = /^https?:\/\//.test(props.href ?? '');

  const component = isExternal ? Link : NavLink;

  const linkProps = {
    ...(props.href ? { component, href: props.href } : {}),
    ...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  };

  return (
    <Card {...linkProps} variant="outlined" visualVariant="catalogEntry">
      {props.children}
    </Card>
  );
}
