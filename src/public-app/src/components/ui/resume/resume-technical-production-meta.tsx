import type { ReactNode } from 'react';
import { Typography } from '../typography';

type ResumeTechnicalProductionMetaProps = { children: ReactNode };

const metaStyles = { gridColumn: { sm: '1 / -1' }, fontStyle: 'italic' };

export function ResumeTechnicalProductionMeta(props: ResumeTechnicalProductionMetaProps) {
  return (
    <Typography variant="body2" color="text.secondary" sx={metaStyles}>
      {props.children}
    </Typography>
  );
}
