'use client';

import { useTranslations } from '@/i18n/compat';
import { CollectionListing } from '../../content/collection-listing';
import { PageHeader } from '../../content/page-header';
import type { Technology } from '@portfolio/data/domain/types';
import { TechnologyCard } from './technology-card';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type TechnologiesPageContentProps = {
  technologies: Technology[];
  pagination: ContentCollectionMeta;
};

export function TechnologiesPageContent(props: TechnologiesPageContentProps) {
  const { technologies } = props;

  const tNav = useTranslations('Nav');

  return (
    <>
      <PageHeader
        eyebrow={tNav('technologies')}
        title={tNav('technologies')}
        description={tNav('technologiesDescription')}
        breadcrumbs={[{ label: tNav('technologies') }]}
      />
      <CollectionListing
        items={technologies}
        getKey={(item) => item.slug}
        renderListItem={TechnologyCard}
        pagination={{ meta: props.pagination, action: '/technologies' }}
      />
    </>
  );
}
