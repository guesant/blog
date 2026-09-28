import type { ElementType, ReactNode } from 'react';
import { Link } from '../link';

type ResumeCaseActionProps = {
  href: string;
  component: ElementType;
  children: ReactNode;
};

const actionStyles = {
  display: 'inline-block',
  fontSize: 'var(--site-text-sm)',
};

export function ResumeCaseAction(props: ResumeCaseActionProps) {
  return (
    <Link component={props.component} href={props.href} sx={actionStyles}>
      {props.children}
    </Link>
  );
}
