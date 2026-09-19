'use client';

import type { HomePageContent, Reference, ReferenceCollection, Writing } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { useEditableContent } from '@portfolio/content/editing';
import { ContentFeed } from '../content/content-feed';
import { HomeContactSection, HomeHero } from './home-page';

type HomeCompositeProps = {
  content: HomePageContent;
  writings: Writing[];
  findings: Reference[];
  collections: ReferenceCollection[];
};

export function HomeComposite(props: HomeCompositeProps) {
  const { content, writings, findings, collections } = props;
  const t = useTranslations('Home');
  const tFeed = useTranslations('Pages.home');
  const tExternalProfiles = useTranslations('ExternalProfiles');
  const { content: page, source: pageSource } = useEditableContent(content.page);
  const {
    content: profile,
    raw: profileRaw,
  } = useEditableContent(content.profile);
  const { content: site, raw: siteSource } = useEditableContent(content.site);
  const contactSource = siteSource.contact as Record<string, unknown>;
  const hasEmail = site.contact.hasEmail;
  const showContact = site.contact.available && (hasEmail || site.contact.profiles.length > 0);

  return (
    <>
      <HomeHero
        page={page}
        pageSource={pageSource}
        profile={profile}
        profileRaw={profileRaw}
        contactSource={contactSource}
        showContact={showContact}
        workTarget={null}
        t={t}
      />
      <ContentFeed
        writings={writings}
        findings={findings}
        collections={collections}
        copy={{ title: tFeed('title'), description: tFeed('description') }}
        action="/"
      />
      <HomeContactSection
        page={page}
        pageSource={pageSource}
        site={site}
        contactSource={contactSource}
        showContact={showContact}
        hasEmail={hasEmail}
        t={t}
        tExternalProfiles={tExternalProfiles}
      />
    </>
  );
}
