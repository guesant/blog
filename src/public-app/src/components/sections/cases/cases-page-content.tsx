'use client';

import { useTranslations } from '@/i18n/compat';
import { EmptyState } from '../../content/empty-state';
import { CollectionListing } from '../../content/collection-listing';
import { EditablePageHeader } from '../../content/page-header';
import type { CasesPageContentProps } from './types';
import { CaseCard } from './case-card';

export function CasesPageContent(props: CasesPageContentProps) {
  const { page: staticPage, items } = props;

  const t = useTranslations('Common');

  const tNav = useTranslations('Nav');

  const page = staticPage;

  return (
    <>
      <EditablePageHeader page={page} breadcrumbs={[{ label: tNav('work') }]} />
      <CollectionListing
        items={items}
        getKey={(item) => item.slug}
        renderListItem={(item) => <CaseCard item={item} />}
        empty={<EmptyState icon="problem">{t('emptyCases')}</EmptyState>}
        pagination={{ meta: props.pagination, action: '/cases' }}
      />
    </>
  );
}
