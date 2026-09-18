'use client';

import Box from '@mui/material/Box';
import { useEditableContent } from '@portfolio/content/editing';
import type { PageIntroduction, Writing } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { EmptyState } from '../content/empty-state';
import { EditablePageHeader } from '../content/page-header';
import { WritingRow } from '../content/writing-row';

type WritingPageContentProps = { page: PageIntroduction; writings: Writing[] };

export function WritingPageContent(props: WritingPageContentProps) {
  const { page: staticPage, writings } = props;
  const t = useTranslations('Common');
  const tNav = useTranslations('Nav');
  const { content: page, source } = useEditableContent(staticPage);
  return (
    <>
      <EditablePageHeader page={page} source={source} breadcrumbs={[{ label: tNav('writing') }]} />
      {writings.length === 0 ? (
        <EmptyState icon="problem">{t('emptyWriting')}</EmptyState>
      ) : (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          {writings.map((writing) => (
            <WritingRow key={writing.slug} writing={writing} />
          ))}
        </Box>
      )}
    </>
  );
}
