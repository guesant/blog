'use client';

import type {
  HomePageContent,
  Reference,
  ReferenceCollection,
  SiteText,
  Writing,
} from '@portfolio/data/domain/types';
import { HomeFeedAndContact } from './home-feed-and-contact';
import { HomeExperienceOptionalSection } from './home-experience-optional-section';
import { HomeProjectsSection } from './home-projects-section';
import { HomeWorkSection } from './home-work-section';
import type { Translator } from '@/i18n/compat-support';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type HomeSectionsAfterHeroProps = {
  content: HomePageContent;
  writings: Writing[];
  findings: Reference[];
  collections: ReferenceCollection[];
  site: SiteText;
  t: Translator;
  tFeed: Translator;
  tExternalProfiles: Translator;
  showContact: boolean;
  hasEmail: boolean;
  feedPagination: ContentCollectionMeta;
};

export function HomeSectionsAfterHero(props: HomeSectionsAfterHeroProps) {
  return (
    <>
      {props.content.cases.length > 0 && (
        <HomeWorkSection cases={props.content.cases} page={props.content.page} t={props.t} />
      )}
      {(props.content.projects.length > 0 || props.content.experimentsCount > 0) && (
        <HomeProjectsSection
          projects={props.content.projects}
          experimentsCount={props.content.experimentsCount}
          page={props.content.page}
          t={props.t}
        />
      )}
      <HomeExperienceOptionalSection content={props.content} t={props.t} />
      <HomeFeedAndContact
        content={props.content}
        writings={props.writings}
        findings={props.findings}
        collections={props.collections}
        site={props.site}
        t={props.t}
        tFeed={props.tFeed}
        tExternalProfiles={props.tExternalProfiles}
        showContact={props.showContact}
        hasEmail={props.hasEmail}
        feedPagination={props.feedPagination}
      />
    </>
  );
}
