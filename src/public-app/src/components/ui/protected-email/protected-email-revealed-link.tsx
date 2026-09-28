import type { ReactNode } from 'react';
import { Link } from '../link';

type ProtectedEmailRevealedLinkProps = {
  href: string;
  children: ReactNode;
};

const linkStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-space-2)',
  fontWeight: 'var(--site-weight-semibold)',
};

export function ProtectedEmailRevealedLink(props: ProtectedEmailRevealedLinkProps) {
  return (
    <Link href={props.href} underline="none" sx={linkStyles}>
      {props.children}
    </Link>
  );
}
