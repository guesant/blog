'use client';

import { Box } from '../../ui';
import type { Writing } from '@portfolio/data/domain/types';
import { useLocale, useTranslations } from '@/i18n/compat';
import { DetailHeader } from '../../content/page-header';
import { ContentActions } from '../../content/content-actions';
import { WritingBody } from './writing-body';
import { joinDefined } from './join-defined';

type WritingDetailContentProps = { item: Writing };

export function WritingDetailContent(props: WritingDetailContentProps) {
  const { item: staticItem } = props;

  const locale = useLocale();

  const tNav = useTranslations('Nav');

  const item = staticItem;

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(item.dateISO));

  return (
    <Box component="article">
      <DetailHeader
        breadcrumbs={[{ label: tNav('writing'), href: '/writing' }, { label: item.title }]}
        eyebrow={joinDefined([item.language?.toUpperCase(), item.type, item.subject])}
        title={item.title}
        description={item.excerpt}
        meta={joinDefined([item.readingTime, formattedDate])}
        actions={
          <ContentActions
            title={item.title}
            url={item.url ?? `/writing/${item.slug}`}
            body={item.body}
            placement="hero"
          />
        }
      />
      <WritingBody item={item} />
    </Box>
  );
}
