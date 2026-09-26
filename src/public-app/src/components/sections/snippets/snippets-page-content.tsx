'use client';

import { useTranslations } from '@/i18n/compat';
import { Typography } from '../../ui';
import { CatalogPageContent } from '../../content/catalog-page-content';
import type { Snippet } from '@portfolio/data/domain/types';
import { SnippetCard } from './snippet-card';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type SnippetsPageContentProps = { snippets: Snippet[]; pagination: ContentCollectionMeta };

export function SnippetsPageContent(props: SnippetsPageContentProps) {
  const tNav = useTranslations('Nav');

  return (
    <CatalogPageContent
      title={tNav('snippets')}
      description={tNav('snippetsDescription')}
      breadcrumbs={[{ label: tNav('snippets') }]}
      items={props.snippets}
      getKey={(item) => item.slug}
      renderListItem={SnippetCard}
      empty={<Typography color="text.secondary">{tNav('noSnippets')}</Typography>}
      pagination={props.pagination}
      paginationAction="/snippets"
    />
  );
}
