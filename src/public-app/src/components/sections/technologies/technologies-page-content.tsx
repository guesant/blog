'use client';

import { useTranslations } from '@/i18n/compat';
import { CatalogPageContent } from '../../content/catalog-page-content';
import type { Technology } from '@portfolio/data/domain/types';
import { TechnologyCard } from './technology-card';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type TechnologiesPageContentProps = {
  technologies: Technology[];
  pagination: ContentCollectionMeta;
};

export function TechnologiesPageContent(props: TechnologiesPageContentProps) {
  const tNav = useTranslations('Nav');

  return (
    <CatalogPageContent
      title={tNav('technologies')}
      description={tNav('technologiesDescription')}
      breadcrumbs={[{ label: tNav('technologies') }]}
      items={props.technologies}
      getKey={(item) => item.slug}
      renderListItem={TechnologyCard}
      pagination={props.pagination}
      paginationAction="/technologies"
    />
  );
}
