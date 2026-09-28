import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeCaseMetaProps = { children: ReactNode };

export function ResumeCaseMeta(props: ResumeCaseMetaProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      {props.children}
    </Typography>
  );
}
