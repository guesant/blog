'use client';

import type {
  HomePageContent,
  Reference,
  ReferenceCollection,
  SiteText,
  Writing,
} from '@portfolio/data/domain/types';
import type { Translator } from '@/i18n/compat-support';
import { ContentFeed } from '../../content/content-feed';
import { HomeContactSection } from './home-contact-section';

type HomeFeedAndContactProps = {
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
};

export function HomeFeedAndContact(props: HomeFeedAndContactProps) {
  return (
    <>
      <ContentFeed
        writings={props.writings}
        findings={props.findings}
        collections={props.collections}
        copy={{ title: props.tFeed('title'), description: props.tFeed('description') }}
        action="/"
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
