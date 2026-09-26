'use client';

import type { HomePageContent, SiteText } from '@portfolio/data/domain/types';
import { HomeEditorialGallery } from './home-editorial-gallery';
import { HomeContactSection } from './home-contact-section';
import type { ExternalProfilesTranslator, HomeTranslator } from '@/i18n/compat-support';

type HomeSectionsAfterHeroProps = {
  content: HomePageContent;
  site: SiteText;
  t: HomeTranslator;
  tExternalProfiles: ExternalProfilesTranslator;
  showContact: boolean;
  hasEmail: boolean;
};

export function HomeSectionsAfterHero(props: HomeSectionsAfterHeroProps) {
  return (
    <>
      <HomeEditorialGallery gallery={props.content.gallery} t={props.t} />
      <HomeContactSection
        page={props.content.page}
        site={props.site}
        showContact={props.showContact}
        hasEmail={props.hasEmail}
        t={props.t}
        tExternalProfiles={props.tExternalProfiles}
      />
    </>
  );
}
