'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { CaseStudy, PageIntroduction } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { EmptyState } from '../content/empty-state';
import { EditablePageHeader } from '../content/page-header';
import { Icon } from '../primitives/icon';
import { NavLink } from '../primitives/nav-link';

type CaseCardProps = { item: CaseStudy };

function CaseCard(props: CaseCardProps) {
  const { item: staticItem } = props;
  const t = useTranslations('Pages.cases');
  const { content: item, source, raw } = useEditableContent(staticItem);

  return (
    <Card
      component={NavLink}
      href={`/cases/${item.slug}`}
      underline="none"
      color="inherit"
      sx={{
        p: 3,
        minHeight: '18rem',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'rgba(255,255,255,.45)',
        transition: 'border-color .2s, background-color .2s, transform .2s',
        '&:hover': {
          borderColor: 'rgba(29,95,167,.55)',
          bgcolor: 'background.paper',
          transform: 'translateY(-2px)',
        },
        '&:hover .case-title': { color: 'secondary.main' },
      }}
    >
      <Typography variant="overline" color="text.secondary" {...getEditableProps(source, 'meta')}>
        {staticItem.number} · {item.meta}
      </Typography>
      <Typography
        className="case-title"
        component="h2"
        variant="h3"
        {...getEditableProps(source, 'title')}
        sx={{ mt: 1.5, fontSize: '1.35rem', transition: 'color .2s' }}
      >
        {item.title}
      </Typography>
      <Typography
        color="text.secondary"
        {...getEditableProps(source, 'summary')}
        sx={{ mt: 1.25, maxWidth: '58ch', fontSize: '.9rem' }}
      >
        {item.summary}
      </Typography>
      <Typography
        {...getEditableProps(raw, 'technologies')}
        sx={{ mt: 'auto', pt: 3, color: 'text.secondary', fontSize: '.8rem' }}
      >
        {item.technologies.join(' · ')}
      </Typography>
      <Typography
        color="secondary"
        sx={{ mt: 2, display: 'inline-flex', gap: 0.75, alignItems: 'center', fontWeight: 600 }}
      >
        {t('viewCase')} <Icon name="north-east" size={15} />
      </Typography>
    </Card>
  );
}

type CasesPageContentProps = { page: PageIntroduction; items: CaseStudy[] };

export function CasesPageContent(props: CasesPageContentProps) {
  const { page: staticPage, items } = props;
  const t = useTranslations('Common');
  const tNav = useTranslations('Nav');
  const { content: page, source } = useEditableContent(staticPage);
  return (
    <>
      <EditablePageHeader page={page} source={source} breadcrumbs={[{ label: tNav('work') }]} />
      {items.length === 0 ? (
        <EmptyState icon="problem">{t('emptyCases')}</EmptyState>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          {items.map((item) => (
            <CaseCard key={item.slug} item={item} />
          ))}
        </Box>
      )}
    </>
  );
}
