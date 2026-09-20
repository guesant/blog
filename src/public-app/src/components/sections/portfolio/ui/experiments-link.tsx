import type { ReactNode } from 'react';
import { Link } from '../../../ui';
import { NavLink } from '../../../primitives/nav-link';

type PortfolioExperimentsLinkProps = {
  children: ReactNode;
};

export function PortfolioExperimentsLink(props: PortfolioExperimentsLinkProps) {
  return (
    <Link
      component={NavLink}
      href="/projects#experiments"
      sx={{ display: 'inline-flex', mt: 'var(--site-space-3)' }}
    >
      {props.children}
    </Link>
  );
}
