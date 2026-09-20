'use client';

import { Button } from '../../../ui';
import { externalProfileLabel } from '@portfolio/data/config/external-profiles';
import { Icon } from '../../../primitives/icon';
import { ProfileIcon } from '../../../primitives/profile-icon';
import type { HomeContactProfileButtonProps } from '../types';

export function HomeContactProfileButton(props: HomeContactProfileButtonProps) {
  const { profile, tExternalProfiles } = props;

  return (
    <Button
      component="a"
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      siteVariant="exploration"
      startIcon={<ProfileIcon platform={profile.platform} size={16} />}
      endIcon={<Icon name="external" size={12} />}
      data-exploration-item="true"
      sx={{ width: '100%', textTransform: 'none' }}
    >
      {externalProfileLabel(profile, tExternalProfiles)}
    </Button>
  );
}
