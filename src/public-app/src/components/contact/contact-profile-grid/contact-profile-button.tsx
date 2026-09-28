import { ContactProfileButton as ContactProfileButtonFrame } from '../../ui/semantic/ContactProfileButton';
import { ContactActionButton } from '../../ui/semantic/ContactActionButton';
import { externalProfileLabel } from '@portfolio/data/config/external-profiles';
import { Icon } from '../../primitives/icon';
import { ProfileIcon } from '../../primitives/profile-icon';
import type { ExternalProfile } from '@portfolio/data/domain/types';
import type { ExternalProfilesTranslator } from '@/i18n/compat-support';

type ContactProfileButtonProps = {
  profile: ExternalProfile;
  tExternalProfiles: ExternalProfilesTranslator;
  presentation?: 'contact' | 'exploration';
};

export function ContactProfileButton(props: ContactProfileButtonProps) {
  const { profile, tExternalProfiles } = props;

  const Frame =
    props.presentation === 'exploration' ? ContactActionButton : ContactProfileButtonFrame;

  return (
    <Frame
      component="a"
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      variant="outlined"
      size="medium"
      startIcon={<ProfileIcon platform={profile.platform} size={16} />}
      endIcon={<Icon name="external" size={12} />}
    >
      {externalProfileLabel(profile, tExternalProfiles)}
    </Frame>
  );
}
