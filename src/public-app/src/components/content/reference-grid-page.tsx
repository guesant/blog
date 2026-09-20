'use client';

import type { Reference } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';
import { AchadosIndexLayout } from './achados-index-layout';
import { ListingView } from './listing-view';
import { ReferenceCard } from './reference-card';

type ReferenceGridPageProps = {
  eyebrow?: string;
  title: string;
  references: Reference[];
};

export function ReferenceGridPage(props: ReferenceGridPageProps) {
  const { eyebrow, title, references } = props;

  const t = useTranslations('Common');

  return (
    <AchadosIndexLayout
      eyebrow={eyebrow}
      title={title}
      emptyMessage={t('emptyAchados')}
      isEmpty={references.length === 0}
    >
      <ListingView
        items={references}
        getKey={(item) => item.slug}
        renderListItem={(reference) => <ReferenceCard reference={reference} headingLevel="h2" />}
      />
    </AchadosIndexLayout>
  );
}
