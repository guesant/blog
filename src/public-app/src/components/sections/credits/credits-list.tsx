'use client';

import { useTranslations } from '@/i18n/compat';
import { CatalogFeedCard } from '../../content/catalog-feed-card';
import { CollectionListing } from '../../content/collection-listing';
import { useSiteFeatureFlags } from '../../content/use-site-feature-flags';
import { EditorialFeedItemDivider } from '../../ui';
import { creditEntryToHomeGalleryEntry } from './credit-entry-home-gallery';
import type { CreditEntry } from './types';

type CreditsListProps = {
  entries: CreditEntry[];
};

export function CreditsList(props: CreditsListProps) {
  const tHome = useTranslations('Home');

  const { feed } = useSiteFeatureFlags();

  return (
    <CollectionListing
      items={props.entries}
      getKey={(entry) => `${entry.category}-${entry.url}-${entry.name}`}
      separator={feed.flatCards ? <EditorialFeedItemDivider /> : undefined}
      renderListItem={(entry) => (
        <CatalogFeedCard entry={creditEntryToHomeGalleryEntry(entry)} t={tHome} />
      )}
    />
  );
}
