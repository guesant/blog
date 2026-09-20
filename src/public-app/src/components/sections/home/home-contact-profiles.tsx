import type { SiteText } from '@portfolio/data/domain/types';
import { ConditionalContent } from '../../primitives/conditional-content';
import { HomeContactProfileButton } from './ui/home-contact-profile-button';
import { HomeContactProfileGrid } from './ui/home-contact-profile-grid';
import type { Translator } from '@/i18n/compat-support';

type HomeContactProfilesProps = {
  site: SiteText;
  tExternalProfiles: Translator;
};

export function HomeContactProfiles(props: HomeContactProfilesProps) {
  return (
    <ConditionalContent
      condition={props.site.contact.profiles.length > 0}
      content={
        <HomeContactProfileGrid>
          {props.site.contact.profiles.map((profile) => (
            <HomeContactProfileButton
              key={profile.url}
              profile={profile}
              tExternalProfiles={props.tExternalProfiles}
            />
          ))}
        </HomeContactProfileGrid>
      }
    />
  );
}
