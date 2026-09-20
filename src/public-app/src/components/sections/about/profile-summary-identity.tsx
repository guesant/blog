import { Typography } from '../../ui';
import type { ProfileSummaryProps } from './types';
import { ProfileBirthDetails } from './profile-birth-details';

type ProfileSummaryIdentityProps = ProfileSummaryProps;

export function ProfileSummaryIdentity(props: ProfileSummaryIdentityProps) {
  return (
    <>
      <Typography variant="overline" color="text.secondary">
        {props.profile.name}
      </Typography>
      <Typography variant="h3" visualVariant="profileSummary">
        {props.profile.title}
      </Typography>
      <Typography color="text.secondary" visualVariant="profileSummary2">
        {props.profile.location}
      </Typography>
      <ProfileBirthDetails
        profile={props.profile}
        age={props.age}
        hasBirthInfo={props.hasBirthInfo}
        t={props.t}
      />
    </>
  );
}
