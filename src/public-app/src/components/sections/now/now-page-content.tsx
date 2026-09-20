'use client';

import { Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { ListingView } from '../../content/listing-view';
import { PageHeader } from '../../content/page-header';
import type { NowPageCopy } from '@portfolio/data/domain/types';
import { CatalogCard } from '../../content/catalog-card';

type NowPageContentProps = { page: NowPageCopy };

export function NowPageContent(props: NowPageContentProps) {
  const { page } = props;

  const tNav = useTranslations('Nav');

  const entries = page.entries;

  return (
    <>
      <PageHeader
        eyebrow={tNav('now')}
        title={tNav('now')}
        description={page.description}
        breadcrumbs={[{ label: tNav('now') }]}
      />
      <ListingView
        items={entries}
        getKey={(entry) => entry.key}
        renderListItem={(entry) => (
          <CatalogCard>
            <Typography variant="overline" color="text.secondary">
              {entry.label}
            </Typography>
            <Typography color="text.secondary">{entry.value}</Typography>
          </CatalogCard>
        )}
      />
    </>
  );
}
