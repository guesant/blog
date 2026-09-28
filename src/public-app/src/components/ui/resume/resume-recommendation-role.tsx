import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeRecommendationRoleProps = { children: ReactNode };

const roleStyles = { gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' };

export function ResumeRecommendationRole(props: ResumeRecommendationRoleProps) {
  return (
    <Typography variant="body2" color="text.secondary" sx={roleStyles}>
      {props.children}
    </Typography>
  );
}
