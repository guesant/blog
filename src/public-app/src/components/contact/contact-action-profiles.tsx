import type { ExternalProfile } from '@portfolio/data/domain/types';
import type { ExternalProfilesTranslator } from '@/i18n/compat-support';
import { ContactProfileButton } from './contact-profile-grid/contact-profile-button';

type ContactActionProfilesProps = {
  profiles: ExternalProfile[];
  tExternalProfiles: ExternalProfilesTranslator;
};

export function ContactActionProfiles(props: ContactActionProfilesProps) {
  return props.profiles.map((profile) => (
    <ContactProfileButton
      key={profile.url}
      profile={profile}
      tExternalProfiles={props.tExternalProfiles}
      siteVariant="exploration"
    />
  ));
}
