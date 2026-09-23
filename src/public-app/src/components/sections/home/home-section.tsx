'use client';

import type { HomePageContent, PublicFeedItem } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { HomeHero } from './home-hero';
import { HomeSectionsAfterHero } from './home-sections-after-hero';
import { homeSectionContact } from './home-section-contact';

export type HomeSectionProps = {
  content: HomePageContent;
  feedItems: PublicFeedItem[];
  feedPagination: import('@portfolio/data/api/public-site-source-support').ContentCollectionMeta;
  feedSearch: string;
};

export function HomeSection(props: HomeSectionProps) {
  const { content, feedItems, feedPagination, feedSearch } = props;

  const t = useTranslations('Home');

  const tFeed = useTranslations('Pages.home');

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
        feedItems={feedItems}
        feedPagination={feedPagination}
        feedSearch={feedSearch}
        site={site}
        t={t}
        tFeed={tFeed}
        tExternalProfiles={tExternalProfiles}
        showContact={contact.showContact}
        hasEmail={contact.hasEmail}
      />
    </>
  );
}
