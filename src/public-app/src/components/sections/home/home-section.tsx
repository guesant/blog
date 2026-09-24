'use client';

import type { HomePageContent } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { HomeHero } from './home-hero';
import { HomeSectionsAfterHero } from './home-sections-after-hero';
import { homeSectionContact } from './home-section-contact';

export type HomeSectionProps = {
  content: HomePageContent;
};

export function HomeSection(props: HomeSectionProps) {
  const { content } = props;

  const t = useTranslations('Home');

  const tExternalProfiles = useTranslations('ExternalProfiles');

  const page = content.page;

  const profile = content.profile;

  const site = content.site;

  const contact = homeSectionContact(site);

  return (
    <>
      <HomeHero
        page={page}
        profile={profile}
        site={site}
        showContact={contact.showContact}
        workTarget={null}
        t={t}
      />
      <HomeSectionsAfterHero
        content={content}
        site={site}
        t={t}
        tExternalProfiles={tExternalProfiles}
        showContact={contact.showContact}
        hasEmail={contact.hasEmail}
      />
    </>
  );
}
