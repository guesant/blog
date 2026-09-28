import type { ElementType, ReactNode } from 'react';
import { Link } from '../link';

type CaseShowcaseReadActionProps = {
  component: ElementType;
  href: string;
  children: ReactNode;
};

const actionStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 'var(--site-space-2)',
  fontWeight: 'var(--site-weight-semibold)',
};

export function CaseShowcaseReadAction(props: CaseShowcaseReadActionProps) {
  return (
    <Link component={props.component} href={props.href} underline="none" sx={actionStyles}>
      {props.children}
    </Link>
  );
}
