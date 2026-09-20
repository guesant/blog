'use client';

import { Box, Typography } from '../../ui';
import type { ProfileMilestonesProps } from './types';
import { ProfileMilestoneItem } from './profile-milestone-item';

export function ProfileMilestones(props: ProfileMilestonesProps) {
  const { profile, t } = props;

  const milestones = profile.milestones ?? [];

  if (milestones.length === 0) {
    return null;
  }
  return (
    <Box visualVariant="profileMilestones">
      <Typography variant="overline" color="text.secondary" visualVariant="profileMilestones">
        {t('milestones')}
      </Typography>
      {milestones.map((item) => (
        <ProfileMilestoneItem key={`${item.year}-${item.title}`} item={item} />
      ))}
    </Box>
  );
}
