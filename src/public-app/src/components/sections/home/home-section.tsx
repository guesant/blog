'use client';

import type { HomePageContent, PublicFeedItem } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { useTranslations } from '@/i18n/compat';
import { HomeHero } from './home-hero';
import { HomeSectionsAfterHero } from './home-sections-after-hero';
import { homeSectionContact } from './home-section-contact';

export type HomeSectionProps = {
  content: HomePageContent;
  feedItems: PublicFeedItem[];
  feedPagination: ContentCollectionMeta;
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
        showAvailability={contact.showAvailability}
        workTarget={null}
        t={t}
      />
      <HomeSectionsAfterHero
        content={content}
        feedItems={props.feedItems}
        feedPagination={props.feedPagination}
        site={site}
        t={t}
        tExternalProfiles={tExternalProfiles}
        showContact={contact.showContact}
        hasEmail={contact.hasEmail}
      />
    </>
  );
}
