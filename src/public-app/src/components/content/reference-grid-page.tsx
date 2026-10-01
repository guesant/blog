'use client';

import type { Reference } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { AchadosIndexLayout } from './achados-index-layout';
import { CollectionListing } from './collection-listing';
import { ReferenceCard } from './reference-card';
import { useSiteFeatureFlags } from './use-site-feature-flags';
import { EditorialFeedItemDivider } from '../ui';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type ReferenceGridPageProps = {
  title: string;
  references: Reference[];
  pagination: ContentCollectionMeta;
  action: string;
};

export function ReferenceGridPage(props: ReferenceGridPageProps) {
  const t = useTranslations('Common');

  const { feed } = useSiteFeatureFlags();

  return (
    <AchadosIndexLayout
      title={props.title}
      emptyMessage={t('emptyAchados')}
      isEmpty={props.references.length === 0}
    >
      <CollectionListing
        items={props.references}
        getKey={(item) => item.slug}
        separator={feed.flatCards ? <EditorialFeedItemDivider /> : undefined}
        renderListItem={(reference) => <ReferenceCard reference={reference} headingLevel="h2" />}
        pagination={{ meta: props.pagination, action: props.action }}
      />
    </AchadosIndexLayout>
  );
}
