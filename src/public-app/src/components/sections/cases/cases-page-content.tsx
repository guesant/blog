'use client';

import { useTranslations } from '@/i18n/compat';
import { EmptyState } from '../../content/empty-state';
import { ListingView } from '../../content/listing-view';
import { EditablePageHeader } from '../../content/page-header';
import type { CasesPageContentProps } from './types';
import { CaseCard } from './case-card';
import { ConditionalContent } from '../../primitives/conditional-content';

export function CasesPageContent(props: CasesPageContentProps) {
  const { page: staticPage, items } = props;

  const t = useTranslations('Common');

  const tNav = useTranslations('Nav');

  const page = staticPage;

  return (
    <>
      <EditablePageHeader page={page} breadcrumbs={[{ label: tNav('work') }]} />
      <ConditionalContent
        condition={items.length === 0}
        content={<EmptyState icon="problem">{t('emptyCases')}</EmptyState>}
      />
      <ConditionalContent
        condition={items.length > 0}
        content={
          <ListingView
            items={items}
            getKey={(item) => item.slug}
            renderListItem={(item) => <CaseCard item={item} />}
          />
        }
      />
    </>
  );
}
