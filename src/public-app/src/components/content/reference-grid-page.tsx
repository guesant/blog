'use client';

import type { Reference } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { AchadosIndexLayout } from './achados-index-layout';
import { CollectionListing } from './collection-listing';
import { ReferenceCard } from './reference-card';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type ReferenceGridPageProps = {
  eyebrow?: string;
  title: string;
  references: Reference[];
  pagination: ContentCollectionMeta;
  action: string;
};

export function ReferenceGridPage(props: ReferenceGridPageProps) {
  const t = useTranslations('Common');

  return (
    <AchadosIndexLayout
      eyebrow={props.eyebrow}
      title={props.title}
      emptyMessage={t('emptyAchados')}
      isEmpty={props.references.length === 0}
    >
      <CollectionListing
        items={props.references}
        getKey={(item) => item.slug}
        renderListItem={(reference) => <ReferenceCard reference={reference} headingLevel="h2" />}
        pagination={{ meta: props.pagination, action: props.action }}
      />
    </AchadosIndexLayout>
  );
}
