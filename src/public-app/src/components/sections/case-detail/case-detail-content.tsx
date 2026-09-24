'use client';

import { Box } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { ContentActions } from '../../content/content-actions';
import { DetailHeader } from '../../content/page-header';
import type { CaseDetailContentProps } from './types';
import { CaseDetailBody } from './case-detail-body';

export function CaseDetailContent(props: CaseDetailContentProps) {
  const { item } = props;

  const t = useTranslations('Pages.cases');

  const tNav = useTranslations('Nav');

  return (
    <Box>
      <DetailHeader
        breadcrumbs={[{ label: tNav('work'), href: '/cases' }, { label: item.title }]}
        title={item.title}
        description={item.summary}
        meta={[item.status, item.meta].filter(Boolean).join(' · ')}
        actions={
          <ContentActions
            title={item.title}
            url={item.url ?? `/cases/${item.slug}`}
            body={item.body}
            placement="hero"
          />
        }
      />
      <CaseDetailBody item={item} t={t} />
    </Box>
  );
}
