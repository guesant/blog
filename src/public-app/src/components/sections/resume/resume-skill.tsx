'use client';

import { Box, Typography } from '../../ui';
import type { ResumeSkillGroup } from './types';

type ResumeSkillProps = {
  group: ResumeSkillGroup;
};

export function ResumeSkill(props: ResumeSkillProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      <Box component="span" visualVariant="resumeSkill">
        {props.group.label}:{' '}
      </Box>
      {(props.group.items ?? []).join(' · ')}
    </Typography>
  );
}
