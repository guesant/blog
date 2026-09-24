'use client';

import { Typography } from '../../ui';
import { CollectionListing } from '../../content/collection-listing';
import { PageHeader } from '../../content/page-header';
import type { FollowPageCopy } from '@portfolio/data/domain/types';
import { renderFollowEntryCard } from './render-follow-entry-card';
import { FollowFutureSection } from './follow-future-section';

type FollowPageContentProps = { page: FollowPageCopy };

export function FollowPageContent(props: FollowPageContentProps) {
  const { page } = props;

  const entries = page.entries;

  const futureEntries = page.futureEntries;

  return (
    <>
      <PageHeader title={page.title} description={page.intro} />
      <Typography variant="overline" color="text.secondary">
        {page.sectionLabel}
      </Typography>
      <Typography component="h2" variant="h2" visualVariant="followSectionTitle">
        {page.sectionTitle}
      </Typography>
      <CollectionListing
        items={entries}
        getKey={(entry) => entry.key}
        renderListItem={renderFollowEntryCard}
      />
      <FollowFutureSection label={page.futureLabel} title={page.futureTitle}>
        <CollectionListing
          items={futureEntries}
          getKey={(entry) => entry.key}
          renderListItem={renderFollowEntryCard}
        />
      </FollowFutureSection>
    </>
  );
}
