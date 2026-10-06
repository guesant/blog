'use client';

import { useTranslations } from '@/i18n/compat';
import { CollectionListing } from '../../content/collection-listing';
import { PageHeader } from '../../content/page-header';
import type { FollowPageCopy } from '@portfolio/data/domain/types';
import { renderFollowEntryCard } from './render-follow-entry-card';
import { FollowFutureSection } from './follow-future-section';
import { FollowCurrentSection } from './follow-current-section';
import { hasCurrentFollowSection } from './has-current-follow-section';
import { hasFutureFollowSection } from './has-future-follow-section';

type FollowPageContentProps = { page: FollowPageCopy };

export function FollowPageContent(props: FollowPageContentProps) {
  const { page } = props;

  const tNav = useTranslations('Nav');

  const entries = page.entries;

  const futureEntries = page.futureEntries;

  const hasCurrentSection = hasCurrentFollowSection(page);

  const hasFutureSection = hasFutureFollowSection(page);

  return (
    <>
      <PageHeader
        title={page.title}
        description={page.intro}
        breadcrumbs={[{ label: tNav('follow') }]}
        variant="showcase"
      />
      {hasCurrentSection ? (
        <FollowCurrentSection title={page.sectionTitle} />
      ) : null}
      <CollectionListing
        items={entries}
        getKey={(entry) => entry.key}
        renderListItem={renderFollowEntryCard}
      />
      {hasFutureSection ? (
        <FollowFutureSection
          entries={futureEntries}
          title={page.futureTitle}
        />
      ) : null}
    </>
  );
}
