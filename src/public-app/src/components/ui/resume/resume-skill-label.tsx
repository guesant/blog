import type { ReactNode } from 'react';
import { Box } from '../box';

type ResumeSkillLabelProps = { children: ReactNode };

const labelStyles = {
  color: 'var(--site-text-primary)',
  fontWeight: 'var(--site-weight-bold)',
};

export function ResumeSkillLabel(props: ResumeSkillLabelProps) {
  return (
    <Box component="span" sx={labelStyles}>
      {props.children}
    </Box>
  );
}
