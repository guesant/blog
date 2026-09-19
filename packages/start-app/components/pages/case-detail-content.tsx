'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { CaseStudy } from '@portfolio/content/types';
import { useTranslations } from '@/i18n/compat';
import { CaseIllustration } from '../content/case-illustration';
import { MetricsGrid } from '../content/detail-layout';
import { DetailHeader } from '../content/page-header';
import { Icon } from '../primitives/icon';

type CaseDetailContentProps = { item: CaseStudy };

export function CaseDetailContent(props: CaseDetailContentProps) {
  const { item: staticItem } = props;
  const t = useTranslations('Pages.cases');
  const tNav = useTranslations('Nav');
  const { content: item, source, raw } = useEditableContent(staticItem);
  const details = [
    { label: t('context'), field: 'context', value: item.context, icon: 'problem' },
    { label: t('role'), field: 'role', value: item.role, icon: 'solution' },
    { label: t('result'), field: 'result', value: item.result, icon: 'evolution' },
  ] as const;

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, maxWidth: '64rem', mx: 'auto' }}>
      <DetailHeader
        backHref="/cases"
        backLabel={t('back')}
        breadcrumbs={[{ label: tNav('work'), href: '/cases' }, { label: item.title }]}
        eyebrow={`${t('detailPrefix')} ${staticItem.number}`}
        title={item.title}
        description={item.summary}
        meta={[item.status, item.meta].filter(Boolean).join(' · ')}
        editableProps={{
          title: getEditableProps(source, 'title'),
          description: getEditableProps(source, 'summary'),
          meta: getEditableProps(source, 'status'),
        }}
      />
      <Box sx={{ mt: { xs: 6, md: 7 } }}>
        <CaseIllustration visual={item.visual} compact />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mt: { xs: 6, md: 8 },
        }}
      >
        {details.map((props) => {
          const { label, field, value, icon } = props;
          return (
            <Box key={field}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}
              >
                <Icon name={icon} size={15} />
                {label}
              </Typography>
              <Typography color="text.secondary" {...getEditableProps(source, field)}>
                {value}
              </Typography>
            </Box>
          );
        })}
      </Box>
      <MetricsGrid
        metrics={item.metrics}
        marginTop={4}
        editableProps={getEditableProps(source, 'metrics')}
      />
      <Typography
        {...getEditableProps(raw, 'technologies')}
        sx={{
          mt: 6,
          pt: 3,
          borderTop: 1,
          borderColor: 'divider',
          color: 'text.secondary',
          fontSize: '.875rem',
        }}
      >
        {item.technologies.join(' · ')}
      </Typography>
    </Box>
  );
}
