'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { CaseStudy } from '@portfolio/content/types';
import { useTranslations } from '@/i18n/compat';
import { Link as LocaleLink } from '../../i18n/navigation';
import { Icon } from '../primitives/icon';
import { CaseIllustration } from './case-illustration';

type CaseLinkProps = { item: CaseStudy; compact?: boolean };

const baseCardSx = {
  display: 'flex',
  flexDirection: 'column',
  p: 3,
  color: 'text.primary',
  textDecoration: 'none',
  bgcolor: 'rgba(255,255,255,.56)',
  transition: 'border-color .2s, background-color .2s, transform .2s',
  '&:hover': {
    borderColor: 'rgba(29,95,167,.55)',
    bgcolor: 'background.paper',
    transform: 'translateY(-2px)',
  },
  '&:hover .case-link-title': { color: 'secondary.main' },
} as const;

const linkCardSx = {
  compact: { ...baseCardSx, minHeight: '14rem' },
  full: { ...baseCardSx, minHeight: 'auto' },
} as const;

const linkTitleSx = {
  compact: { mt: 1.5, fontSize: '1.25rem', transition: 'color .2s' },
  full: { mt: 1.5, fontSize: '1.5rem', transition: 'color .2s' },
} as const;

const summarySx = { mt: 1.25, maxWidth: '52ch', fontSize: '.9rem' } as const;
const techSx = { mt: 'auto', pt: 3, color: 'text.secondary', fontSize: '.8rem' } as const;
const readMoreSx = {
  mt: 2,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  fontWeight: 600,
} as const;

function CaseLink(props: CaseLinkProps) {
  const { item, compact = false } = props;
  const t = useTranslations('CaseShowcase');
  const { content, source, raw } = useEditableContent(item);

  return (
    <Card
      component={LocaleLink}
      href={`/cases/${content.slug}`}
      sx={compact ? linkCardSx.compact : linkCardSx.full}
    >
      <Typography variant="overline" color="text.secondary">
        {t('selectedCase')} {item.number} · {content.status ?? content.meta}
      </Typography>
      <Typography
        className="case-link-title"
        {...getEditableProps(source, 'title')}
        variant="h3"
        sx={compact ? linkTitleSx.compact : linkTitleSx.full}
      >
        {content.title}
      </Typography>
      <Typography color="text.secondary" {...getEditableProps(source, 'summary')} sx={summarySx}>
        {content.summary}
      </Typography>
      <Typography {...getEditableProps(raw, 'technologies')} sx={techSx}>
        {content.technologies.join(' · ')}
      </Typography>
      <Typography color="secondary" sx={readMoreSx}>
        {t('readFullCase')} <Icon name="north-east" size={15} />
      </Typography>
    </Card>
  );
}

type CaseShowcaseProps = { cases: CaseStudy[] };

export function CaseShowcase(props: CaseShowcaseProps) {
  const { cases } = props;
  const t = useTranslations('CaseShowcase');
  const { content: featuredCase, source, raw } = useEditableContent(cases[0]);
  const secondaryCases = cases.slice(1, 3);

  return (
    <Box>
      <Card
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
          minHeight: { md: '21.5rem' },
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            display: 'grid',
            alignItems: 'center',
            bgcolor: '#eef2f8',
            borderRight: { md: 1 },
            borderBottom: { xs: 1, md: 0 },
            borderColor: 'divider',
          }}
        >
          <CaseIllustration visual={featuredCase.visual} compact />
        </Box>
        <Box sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="overline" color="text.secondary">
            {t('selectedCase')} {featuredCase.number} · {featuredCase.meta}
          </Typography>
          <Typography
            variant="h3"
            {...getEditableProps(source, 'title')}
            sx={{ mt: 1.5, fontSize: { xs: '1.5rem', md: '1.75rem' } }}
          >
            {featuredCase.title}
          </Typography>
          <Typography
            color="text.secondary"
            {...getEditableProps(source, 'summary')}
            sx={{ mt: 1.25, maxWidth: '56ch' }}
          >
            {featuredCase.summary}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2.5,
              mt: 3,
              pt: 3,
              borderTop: 1,
              borderColor: 'divider',
            }}
          >
            {[
              [t('context'), featuredCase.context],
              [t('role'), featuredCase.role],
              [t('outcome'), featuredCase.result],
            ].map(([label, value], index) => (
              <Box key={label} {...getEditableProps(source, ['context', 'role', 'result'][index])}>
                <Typography sx={{ fontSize: '.75rem', fontWeight: 650, color: 'text.secondary' }}>
                  {label}
                </Typography>
                <Typography sx={{ mt: 0.75, fontSize: '.875rem' }}>{value}</Typography>
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              mt: 'auto',
              pt: 3,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Typography
              {...getEditableProps(raw, 'technologies')}
              sx={{ color: 'text.secondary', fontSize: '.8rem' }}
            >
              {featuredCase.technologies.join(' · ')}
            </Typography>
            <Link
              component={LocaleLink}
              href={`/cases/${featuredCase.slug}`}
              underline="none"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 650 }}
            >
              {t('readFullCase')} <Icon name="north-east" size={15} />
            </Link>
          </Box>
        </Box>
      </Card>

      {secondaryCases.length > 0 && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2,
            mt: 2,
          }}
        >
          {secondaryCases.map((item) => (
            <CaseLink key={item.slug} item={item} compact />
          ))}
        </Box>
      )}
    </Box>
  );
}
