'use client';

import type { HomePageContent, PublicFeedItem, SiteText } from '@portfolio/data/domain/types';
import { HomeFeedAndContact } from './home-feed-and-contact';
import { HomeEditorialGallery } from './home-editorial-gallery';
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
      <HomeEditorialGallery gallery={props.content.gallery} t={props.t} />
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
