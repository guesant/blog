'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReferenceCollection } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { AchadosIndexLayout } from '../content/achados-index-layout';
import { NavLink } from '../primitives/nav-link';

const rowSx = {
  display: 'block',
  py: 2.5,
  borderTop: 1,
  borderColor: 'divider',
  '&:hover .collection-title': { color: 'secondary.main' },
} as const;

type CollectionRowProps = { collection: ReferenceCollection };

function CollectionRow(props: CollectionRowProps) {
  const { collection } = props;
  return (
    <NavLink href={`/colecoes/${collection.slug}`} underline="none" color="inherit" sx={rowSx}>
      <Typography
        className="collection-title"
        variant="subtitle2"
        component="h2"
        sx={{ fontWeight: 600, mb: 0.5, transition: 'color .2s' }}
      >
        {collection.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '56ch' }}>
        {collection.description}
      </Typography>
    </NavLink>
  );
}

type ColecoesPageContentProps = { collections: ReferenceCollection[] };

export function ColecoesPageContent(props: ColecoesPageContentProps) {
  const { collections } = props;
  const t = useTranslations('Common');
  const tPages = useTranslations('Pages.collections');

  return (
    <AchadosIndexLayout
      title={tPages('indexTitle')}
      description={tPages('indexDescription')}
      emptyMessage={t('emptyCollections')}
      isEmpty={collections.length === 0}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: { xs: 9, md: 11 } }}>
        {collections.map((collection) => (
          <CollectionRow key={collection.slug} collection={collection} />
        ))}
      </Box>
    </AchadosIndexLayout>
  );
}
