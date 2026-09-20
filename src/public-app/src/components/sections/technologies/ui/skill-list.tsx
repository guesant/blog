import type { ReactNode } from 'react';
import { Box } from '../../../ui';

type TechnologySkillListProps = {
  children: ReactNode;
};

export function TechnologySkillList(props: TechnologySkillListProps) {
  return (
    <Box
      sx={{
        mt: 'var(--site-space-4)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--site-space-2)',
      }}
    >
      {props.children}
    </Box>
  );
}
