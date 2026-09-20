'use client';

import type {
  HomePageContent,
  Reference,
  ReferenceCollection,
  Writing,
} from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { HomeHero } from './home-hero';
import { HomeSectionsAfterHero } from './home-sections-after-hero';

export type HomeSectionProps = {
  content: HomePageContent;
  writings: Writing[];
  findings: Reference[];
  collections: ReferenceCollection[];
};

export function HomeSection(props: HomeSectionProps) {
  const { content, writings, findings, collections } = props;

  const t = useTranslations('Home');

  const tFeed = useTranslations('Pages.home');

  const tExternalProfiles = useTranslations('ExternalProfiles');

  const page = content.page;

  const profile = content.profile;

  const site = content.site;

  const hasEmail = site.contact.hasEmail;

  const showContact = site.contact.available && (hasEmail || site.contact.profiles.length > 0);

  return (
    <>
      <HomeHero
        page={page}
        profile={profile}
        site={site}
        showContact={showContact}
        workTarget={null}
        t={t}
      />
      <HomeSectionsAfterHero
        content={content}
        writings={writings}
        findings={findings}
        collections={collections}
        site={site}
        t={t}
        tFeed={tFeed}
        tExternalProfiles={tExternalProfiles}
        showContact={showContact}
        hasEmail={hasEmail}
      />
    </>
  );
}
