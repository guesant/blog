'use client';

import type { Writing } from '@portfolio/data/domain/types';
import { useLocale, useTranslations } from '@/i18n/compat';
import { DetailArticle } from '../../content/detail-layout';
import { DetailHeader } from '../../content/page-header';
import { ContentActions } from '../../content/content-actions';
import { useContentActionsVisibility } from '../../content/use-content-actions-visibility';
import { WritingBody } from './writing-body';
import { joinDefined } from './join-defined';

type WritingDetailContentProps = { item: Writing };

export function WritingDetailContent(props: WritingDetailContentProps) {
  const { item: staticItem } = props;

  const locale = useLocale();

  const tNav = useTranslations('Nav');

  const actionsVisible = useContentActionsVisibility();

  const item = staticItem;

  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(item.dateISO));

  return (
    <DetailArticle>
      <DetailHeader
        breadcrumbs={[{ label: tNav('writing'), href: '/writing' }, { label: item.title }]}
        title={item.title}
        meta={joinDefined([item.readingTime, formattedDate])}
        actions={
          actionsVisible ? (
            <ContentActions
              title={item.title}
              url={item.url ?? `/writing/${item.slug}`}
              body={item.body}
              placement="hero"
            />
          ) : undefined
        }
      />
      <WritingBody item={item} />
    </DetailArticle>
  );
}
