import type { ReactNode } from 'react';
import { ExternalLink } from '../../primitives/external-link';

type ResumeEntryTitleExternalProps = {
  href: string;
  children: ReactNode;
};

const linkStyles = {
  color: 'inherit',
  fontWeight: 'var(--site-weight-bold)',
  textDecoration: 'none',
};

export function ResumeEntryTitleExternal(props: ResumeEntryTitleExternalProps) {
  return (
    <ExternalLink href={props.href} sx={linkStyles}>
      {props.children}
    </ExternalLink>
  );
}
