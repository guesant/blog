import { Button } from '../../ui';
import { externalProfileLabel } from '@portfolio/data/config/external-profiles';
import { Icon } from '../../primitives/icon';
import { ProfileIcon } from '../../primitives/profile-icon';
import type { ExternalProfile } from '@portfolio/data/domain/types';

type ContactProfileButtonProps = {
  profile: ExternalProfile;
  tExternalProfiles: (key: string) => string;
};

export function ContactProfileButton(props: ContactProfileButtonProps) {
  const { profile, tExternalProfiles } = props;

  return (
    <Button
      component="a"
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      variant="outlined"
      siteVariant="contact"
      size="medium"
      startIcon={<ProfileIcon platform={profile.platform} size={16} />}
      endIcon={<Icon name="external" size={12} />}
    >
      {externalProfileLabel(profile, tExternalProfiles)}
    </Button>
  );
}
