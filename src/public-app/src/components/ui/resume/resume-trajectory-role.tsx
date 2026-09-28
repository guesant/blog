import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeTrajectoryRoleProps = { children: ReactNode };

const roleStyles = { gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' };

export function ResumeTrajectoryRole(props: ResumeTrajectoryRoleProps) {
  return (
    <Typography variant="body2" color="text.secondary" sx={roleStyles}>
      {props.children}
    </Typography>
  );
}
