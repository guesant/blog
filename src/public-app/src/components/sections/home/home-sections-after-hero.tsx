'use client';

import type { HomePageContent, PublicFeedItem, SiteText } from '@portfolio/data/domain/types';
import { HomeFeedAndContact } from './home-feed-and-contact';
import { HomeExperienceOptionalSection } from './home-experience-optional-section';
import { HomeFeaturedSections } from './home-featured-sections';
import type { Translator } from '@/i18n/compat-support';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type HomeSectionsAfterHeroProps = {
  content: HomePageContent;
  feedItems: PublicFeedItem[];
  site: SiteText;
  t: Translator;
  tFeed: Translator;
  tExternalProfiles: Translator;
  showContact: boolean;
  hasEmail: boolean;
  feedPagination: ContentCollectionMeta;
  feedSearch: string;
};

export function HomeSectionsAfterHero(props: HomeSectionsAfterHeroProps) {
  return (
    <>
      <HomeFeaturedSections content={props.content} t={props.t} />
      <HomeExperienceOptionalSection content={props.content} t={props.t} />
      <HomeFeedAndContact
        content={props.content}
        feedItems={props.feedItems}
        site={props.site}
        t={props.t}
        tFeed={props.tFeed}
        tExternalProfiles={props.tExternalProfiles}
        showContact={props.showContact}
        hasEmail={props.hasEmail}
        feedPagination={props.feedPagination}
        feedSearch={props.feedSearch}
      />
    </>
  );
}
