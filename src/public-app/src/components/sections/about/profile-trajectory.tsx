'use client';

import { Box, Typography } from '../../ui';
import type { ProfileTrajectoryProps } from './types';
import { ProfileTrajectoryItem } from './profile-trajectory-item';

export function ProfileTrajectory(props: ProfileTrajectoryProps) {
  const { profile, t } = props;

  if (profile.trajectory.length === 0) {
    return null;
  }
  return (
    <Box visualVariant="profileTrajectory">
      <Typography variant="overline" color="text.secondary" visualVariant="profileTrajectory">
        {t('trajectory')}
      </Typography>
      {profile.trajectory.map((item) => (
        <ProfileTrajectoryItem key={`${item.organization}-${item.period}`} item={item} />
      ))}
    </Box>
  );
}
