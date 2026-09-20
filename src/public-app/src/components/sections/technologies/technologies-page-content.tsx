'use client';

import { useTranslations } from '@/i18n/compat';
import { ListingView } from '../../content/listing-view';
import { PageHeader } from '../../content/page-header';
import type { Technology } from '@portfolio/data/domain/types';
import { TechnologyCard } from './technology-card';

type TechnologiesPageContentProps = { technologies: Technology[] };

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
      <ListingView
        items={technologies}
        getKey={(item) => item.slug}
        renderListItem={TechnologyCard}
      />
    </>
  );
}
