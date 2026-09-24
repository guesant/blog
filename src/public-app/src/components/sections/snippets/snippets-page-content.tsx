'use client';

import { Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { CollectionListing } from '../../content/collection-listing';
import { PageHeader } from '../../content/page-header';
import type { Snippet } from '@portfolio/data/domain/types';
import { SnippetCard } from './snippet-card';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

type SnippetsPageContentProps = { snippets: Snippet[]; pagination: ContentCollectionMeta };

export function SnippetsPageContent(props: SnippetsPageContentProps) {
  const { snippets } = props;

  const tNav = useTranslations('Nav');

  return (
    <>
      <PageHeader
        title={tNav('snippets')}
        description={tNav('snippetsDescription')}
        breadcrumbs={[{ label: tNav('snippets') }]}
      />
      <CollectionListing
        items={snippets}
        getKey={(item) => item.slug}
        renderListItem={SnippetCard}
        empty={<Typography color="text.secondary">{tNav('noSnippets')}</Typography>}
        pagination={{ meta: props.pagination, action: '/snippets' }}
      />
    </>
  );
}
