import type { ElementType, ReactNode } from 'react';
import { Link } from '../link';

type ResumeCaseLinkProps = {
  href: string;
  component: ElementType;
  children: ReactNode;
};

const linkStyles = {
  color: 'inherit',
  fontWeight: 'var(--site-weight-bold)',
  textDecoration: 'none',
};

export function ResumeCaseLink(props: ResumeCaseLinkProps) {
  return (
    <Link component={props.component} href={props.href} underline="none" sx={linkStyles}>
      {props.children}
    </Link>
  );
}
