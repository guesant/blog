'use client';

import Box from '@mui/material/Box';
import { ContentRichText, getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { Writing } from '@portfolio/content/types';
import { useLocale, useTranslations } from 'next-intl';
import { DetailHeader } from '../content/page-header';

type WritingDetailContentProps = { item: Writing };

function joinDefined(parts: (string | undefined)[]) {
  return parts.filter((part) => part && part.length > 0).join(' · ');
}

export function WritingDetailContent(props: WritingDetailContentProps) {
  const { item: staticItem } = props;
  const locale = useLocale();
  const t = useTranslations('Pages.writings');
  const tNav = useTranslations('Nav');
  const { content: item, source } = useEditableContent(staticItem);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(item.dateISO));

  return (
    <Box component="article" sx={{ py: { xs: 8, md: 10 }, maxWidth: '48rem', mx: 'auto' }}>
      <DetailHeader
        backHref="/writing"
        backLabel={t('back')}
        breadcrumbs={[{ label: tNav('writing'), href: '/writing' }, { label: item.title }]}
        eyebrow={joinDefined([item.language?.toUpperCase(), item.type, item.subject])}
        title={item.title}
        description={item.excerpt}
        meta={joinDefined([item.readingTime, formattedDate])}
        editableProps={{
          eyebrow: getEditableProps(source, 'type'),
          title: getEditableProps(source, 'title'),
          description: getEditableProps(source, 'excerpt'),
          meta: getEditableProps(source, 'readingTime'),
        }}
      />
      <Box sx={{ mt: 7, pt: 5, borderTop: 1, borderColor: 'divider' }}>
        <Box
          {...getEditableProps(source, 'body')}
          sx={{
            '& p, & li': { fontSize: '1.1rem', lineHeight: 1.8 },
            '& p': { mb: 3 },
            '& h2': { fontSize: '1.75rem', mt: 6, mb: 2 },
            '& h3': { fontSize: '1.35rem', mt: 5, mb: 2 },
            '& ul, & ol': { pl: 3, mb: 3 },
            '& pre': { overflowX: 'auto', p: 2.5, bgcolor: 'background.paper' },
            '& code': { fontFamily: 'var(--font-mono)' },
            '& a': { color: 'primary.main' },
          }}
        >
          <ContentRichText content={item.body} />
        </Box>
      </Box>
    </Box>
  );
}
