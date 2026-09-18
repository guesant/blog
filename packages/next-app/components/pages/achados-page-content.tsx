'use client';

import Box from '@mui/material/Box';
import { useEditableContent } from '@portfolio/content/editing';
import type { PageIntroduction, Reference } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { EmptyState } from '../content/empty-state';
import { EditablePageHeader } from '../content/page-header';
import { ReferenceCard } from '../content/reference-card';
import { SearchAndFilterBar } from '../content/search-and-filter-bar';

type AchadosPageContentProps = { page: PageIntroduction; references: Reference[] };

export function AchadosPageContent(props: AchadosPageContentProps) {
  const { page: staticPage, references } = props;
  const t = useTranslations('Common');
  const tAchados = useTranslations('Pages.achados');
  const tNav = useTranslations('Nav');
  const { content: page, source } = useEditableContent(staticPage);
  const [visibleSlugs, setVisibleSlugs] = useState<Set<string> | null>(null);

  const displayedReferences = useMemo(
    () =>
      visibleSlugs
        ? references.filter((reference) => visibleSlugs.has(reference.slug))
        : references,
    [references, visibleSlugs],
  );

  return (
    <>
      <EditablePageHeader page={page} source={source} breadcrumbs={[{ label: tNav('achados') }]} />
      {references.length === 0 ? (
        <EmptyState icon="problem">{t('emptyAchados')}</EmptyState>
      ) : (
        <>
          <SearchAndFilterBar references={references} onVisibleSlugsChange={setVisibleSlugs} />
          {displayedReferences.length === 0 ? (
            <EmptyState icon="problem">{tAchados('noResults')}</EmptyState>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
                mb: { xs: 9, md: 11 },
              }}
            >
              {displayedReferences.map((reference) => (
                <ReferenceCard key={reference.slug} reference={reference} headingLevel="h2" />
              ))}
            </Box>
          )}
        </>
      )}
    </>
  );
}
