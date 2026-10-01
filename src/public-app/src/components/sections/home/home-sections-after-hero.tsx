'use client';

import type { HomePageContent, PublicFeedItem, SiteText } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { HomeEditorialGallery } from './home-editorial-gallery';
import { HomeContactSection } from './home-contact-section';
import type { ExternalProfilesTranslator, HomeTranslator } from '@/i18n/compat-support';

type HomeSectionsAfterHeroProps = {
  content: HomePageContent;
  feedItems: PublicFeedItem[];
  feedPagination: ContentCollectionMeta;
  site: SiteText;
  t: HomeTranslator;
  tExternalProfiles: ExternalProfilesTranslator;
  showContact: boolean;
  hasEmail: boolean;
};

export function HomeSectionsAfterHero(props: HomeSectionsAfterHeroProps) {
  return (
    <>
      <HomeEditorialGallery
        gallery={props.content.gallery}
        feedItems={props.feedItems}
        feedPagination={props.feedPagination}
        t={props.t}
      />
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
