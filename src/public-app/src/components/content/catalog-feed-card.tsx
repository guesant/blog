import type { HomeGalleryEntry } from '@portfolio/data/domain/types';
import type { HomeTranslator } from '@/i18n/compat-support';
import { EditorialCatalogFeedCard } from './editorial-catalog-feed-card';
import { TraditionalCatalogFeedCard } from './traditional-catalog-feed-card';
import { useSiteFeatureFlags } from './use-site-feature-flags';

export type CatalogFeedCardProps = {
  entry: HomeGalleryEntry;
  t: HomeTranslator;
};

export function CatalogFeedCard(props: CatalogFeedCardProps) {
  const { feed } = useSiteFeatureFlags();

  return feed.flatCards ? (
    <EditorialCatalogFeedCard {...props} />
  ) : (
    <TraditionalCatalogFeedCard {...props} />
  );
}
