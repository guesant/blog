'use client';

import { Typography } from '../../ui';
import type { ProfileBirthDetailsProps } from './types';
import { ProfileBirthAge } from './profile-birth-age';
import { ProfileBirthCity } from './profile-birth-city';
import { ProfileBirthSeparator } from './profile-birth-separator';

export function ProfileBirthDetails(props: ProfileBirthDetailsProps) {
  if (!props.hasBirthInfo) {
    return null;
  }

  const hasCity = Boolean(props.profile.birthCity?.trim());

  return (
    <Typography color="text.secondary" visualVariant="profileBirthDetails">
      <ProfileBirthAge age={props.age} t={props.t} />
      <ProfileBirthSeparator hasAge={props.age !== undefined} hasCity={hasCity} />
      <ProfileBirthCity profile={props.profile} />
    </Typography>
  );
}
