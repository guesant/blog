import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeCaseRoleProps = { children: ReactNode };

const roleStyles = { marginBlockStart: 'var(--site-space-1)' };

export function ResumeCaseRole(props: ResumeCaseRoleProps) {
  return (
    <Typography variant="body2" sx={roleStyles}>
      {props.children}
    </Typography>
  );
}
