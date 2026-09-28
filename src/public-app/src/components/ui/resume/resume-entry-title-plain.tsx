import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeEntryTitlePlainProps = { children: ReactNode };

const titleStyles = { fontWeight: 'var(--site-weight-bold)' };

export function ResumeEntryTitlePlain(props: ResumeEntryTitlePlainProps) {
  return <Typography sx={titleStyles}>{props.children}</Typography>;
}
