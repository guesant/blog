import type { ExternalProfile } from '@portfolio/data/domain/types';
import type { ExternalProfilesTranslator } from '@/i18n/compat-support';
import { ContactExternalProfileLink } from './contact-profile-grid/contact-external-profile-link';

type ContactActionProfilesProps = {
  profiles: ExternalProfile[];
  tExternalProfiles: ExternalProfilesTranslator;
};

export function ContactActionProfiles(props: ContactActionProfilesProps) {
  return props.profiles.map((profile) => (
    <ContactExternalProfileLink
      key={profile.url}
      profile={profile}
      tExternalProfiles={props.tExternalProfiles}
    />
  ));
}
