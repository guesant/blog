import { Box } from '../../ui';
import type { ProfileBirthDetailsProps } from './types';

type ProfileBirthAgeProps = Pick<ProfileBirthDetailsProps, 'age' | 't'>;

export function ProfileBirthAge(props: ProfileBirthAgeProps) {
  if (props.age === undefined) {
    return null;
  }

  return <Box component="span">{props.t('age', { age: props.age })}</Box>;
}
