import { Box } from '../../ui';
import type { ProfileBirthDetailsProps } from './types';

type ProfileBirthCityProps = Pick<ProfileBirthDetailsProps, 'profile'>;

export function ProfileBirthCity(props: ProfileBirthCityProps) {
  if (!props.profile.birthCity?.trim()) {
    return null;
  }

  return <Box component="span">{props.profile.birthCity}</Box>;
}
