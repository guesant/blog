import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeEducationDegreeProps = { children: ReactNode };

const degreeStyles = { fontStyle: 'italic' };

export function ResumeEducationDegree(props: ResumeEducationDegreeProps) {
  return (
    <Typography variant="body2" sx={degreeStyles}>
      {props.children}
    </Typography>
  );
}
