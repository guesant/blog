import { Box } from '../../ui';
import type { ContactProfileGridProps } from './types';
import { ContactProfileButton } from './contact-profile-button';

export function ContactProfileGrid(props: ContactProfileGridProps) {
  const { profiles, tExternalProfiles } = props;

  return (
    <Box visualVariant="contactProfileGrid">
      {profiles.map((profile) => (
        <ContactProfileButton
          key={profile.url}
          profile={profile}
          tExternalProfiles={tExternalProfiles}
        />
      ))}
    </Box>
  );
}
