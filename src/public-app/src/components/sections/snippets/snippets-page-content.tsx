'use client';

import { Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { ListingView } from '../../content/listing-view';
import { PageHeader } from '../../content/page-header';
import type { Snippet } from '@portfolio/data/domain/types';
import { ConditionalContent } from '../../primitives/conditional-content';
import { SnippetCard } from './snippet-card';

type SnippetsPageContentProps = { snippets: Snippet[] };

export function SnippetsPageContent(props: SnippetsPageContentProps) {
  const { snippets } = props;

  const tNav = useTranslations('Nav');

  return (
    <>
      <PageHeader
        eyebrow={tNav('snippets')}
        title={tNav('snippets')}
        description={tNav('snippetsDescription')}
        breadcrumbs={[{ label: tNav('snippets') }]}
      />
      <ConditionalContent
        condition={snippets.length === 0}
        content={<Typography color="text.secondary">{tNav('noSnippets')}</Typography>}
      />
      <ConditionalContent
        condition={snippets.length > 0}
        content={
          <ListingView items={snippets} getKey={(item) => item.slug} renderListItem={SnippetCard} />
        }
      />
    </>
  );
}
