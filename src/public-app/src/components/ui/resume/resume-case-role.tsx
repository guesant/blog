import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeCaseRoleProps = { children: ReactNode };

export function ResumeCaseRole(props: ResumeCaseRoleProps) {
  return <Typography variant="body2">{props.children}</Typography>;
}
