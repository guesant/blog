'use client';

import Box from '@mui/material/Box';
import type { Reference } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { AchadosIndexLayout } from './achados-index-layout';
import { ReferenceCard } from './reference-card';

type ReferenceGridPageProps = {
  eyebrow?: string;
  title: string;
  references: Reference[];
};

export function ReferenceGridPage(props: ReferenceGridPageProps) {
  const { eyebrow, title, references } = props;
  const t = useTranslations('Common');

  return (
    <AchadosIndexLayout
      eyebrow={eyebrow}
      title={title}
      emptyMessage={t('emptyAchados')}
      isEmpty={references.length === 0}
    >
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
        {references.map((reference) => (
          <ReferenceCard key={reference.slug} reference={reference} headingLevel="h2" />
        ))}
      </Box>
    </AchadosIndexLayout>
  );
}
