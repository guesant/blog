'use client';

import { ResumeSkillLabel, Typography } from '../../ui';
import type { ResumeSkillGroup } from './types';

type ResumeSkillProps = {
  group: ResumeSkillGroup;
};

export function ResumeSkill(props: ResumeSkillProps) {
  return (
    <Typography variant="body2" color="text.secondary">
      <ResumeSkillLabel>{props.group.label}: </ResumeSkillLabel>
      {(props.group.items ?? []).join(' · ')}
    </Typography>
  );
}
