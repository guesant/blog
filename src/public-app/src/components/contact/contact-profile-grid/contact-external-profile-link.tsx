import { externalProfileLabel } from '@portfolio/data/config/external-profiles';
import type { ExternalProfile } from '@portfolio/data/domain/types';
import type { ExternalProfilesTranslator } from '@/i18n/compat-support';
import { Icon } from '../../primitives/icon';
import { ProfileIcon } from '../../primitives/profile-icon';
import { ContactProfileButton } from '../../ui/semantic/ContactProfileButton';

export type ContactExternalProfileLinkProps = {
  profile: ExternalProfile;
  tExternalProfiles: ExternalProfilesTranslator;
};

export function ContactExternalProfileLink(props: ContactExternalProfileLinkProps) {
  return (
    <ContactProfileButton
      component="a"
      href={props.profile.url}
      target="_blank"
      rel="noopener noreferrer"
      variant="outlined"
      size="medium"
      startIcon={<ProfileIcon platform={props.profile.platform} size={16} />}
      endIcon={<Icon name="external" size={12} />}
    >
      {externalProfileLabel(props.profile, props.tExternalProfiles)}
    </ContactProfileButton>
  );
}
