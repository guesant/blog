import { Box, Typography } from '../../ui';
import type { ProfileSummaryProps } from './types';
import { PersonalInterestItem } from './personal-interest-item';

type ProfileSummaryInterestsProps = Pick<ProfileSummaryProps, 'profile' | 't'>;

export function ProfileSummaryInterests(props: ProfileSummaryInterestsProps) {
  if (props.profile.personalInterests.length === 0) {
    return null;
  }

  return (
    <Box visualVariant="profileSummary">
      <Typography variant="overline" color="text.secondary">
        {props.t('personalInterests')}
      </Typography>
      <Box component="ul" visualVariant="profileSummary2">
        {props.profile.personalInterests.map((interest) => (
          <PersonalInterestItem key={interest} interest={interest} />
        ))}
      </Box>
    </Box>
  );
}
