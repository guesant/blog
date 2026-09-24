import type { useTranslations } from '@/i18n/compat';
import type { ExternalProfile } from '@portfolio/data/domain/types';
import { ContactProfileButton } from './contact-profile-grid/contact-profile-button';

type ContactActionProfilesProps = {
  profiles: ExternalProfile[];
  tExternalProfiles: ReturnType<typeof useTranslations>;
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
