import type { ElementType, ReactNode } from 'react';
import { Link } from '../link';

type SidebarBrandLinkFrameProps = {
  children: ReactNode;
  component?: ElementType;
  href?: string;
};

const styles = {
  display: 'inline-block',
  margin: 0,
  color: 'var(--site-text-primary)',
  fontFamily: 'var(--site-font-mono)',
  fontSize: 'var(--site-text-sm)',
  fontWeight: 'var(--site-weight-bold)',
  letterSpacing: 'var(--site-letter-label)',
  textDecoration: 'none',
};

export function SidebarBrandLinkFrame(props: SidebarBrandLinkFrameProps) {
  return (
    <Link {...props} sx={styles}>
      {props.children}
    </Link>
  );
}
