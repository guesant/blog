'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ContentRichText, getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { ReferenceCollectionDetail } from '@portfolio/content/types';
import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../content/page-header';
import { ReferenceCard } from '../content/reference-card';

type ColecaoDetailContentProps = { collection: ReferenceCollectionDetail };

export function ColecaoDetailContent(props: ColecaoDetailContentProps) {
  const { collection: staticCollection } = props;
  const { items } = staticCollection;
  const tPages = useTranslations('Pages.collections');
  const tNav = useTranslations('Nav');
  const { content: collection, source } = useEditableContent(staticCollection);

  return (
    <>
      <PageHeader
        eyebrow={tPages('eyebrow')}
        title={collection.title}
        description={collection.description}
        breadcrumbs={[{ label: tNav('achados'), href: '/findings' }, { label: collection.title }]}
        editableProps={{
          title: getEditableProps(source, 'title'),
          description: getEditableProps(source, 'description'),
        }}
      />
      {collection.intro && (
        <Box {...getEditableProps(source, 'intro')} sx={{ mb: { xs: 6, md: 8 }, maxWidth: '60ch' }}>
          <ContentRichText content={collection.intro} />
        </Box>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mb: { xs: 9, md: 11 } }}>
        {items.map((item) => (
          <Box key={item.reference.slug}>
            <ReferenceCard reference={item.reference} headingLevel="h2" />
            {item.note && (
              <Typography
                color="text.secondary"
                sx={{ mt: 1.5, fontStyle: 'italic', maxWidth: '52ch' }}
              >
                {item.note}
              </Typography>
            )}
          </Box>
        ))}
      </Box>
    </>
  );
}
