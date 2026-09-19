'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { Reference } from '@portfolio/content/types';
import { useTranslations } from '@/i18n/compat';
import { toMessageKey } from '../../content/achados';
import { NavLink } from '../primitives/nav-link';
import { ScrollReveal } from '../primitives/scroll-reveal';

type ReferenceCardProps = { reference: Reference; headingLevel?: 'h2' | 'h3' };

const cardSx = {
  minHeight: '15rem',
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  bgcolor: 'rgba(255,255,255,.72)',
  borderColor: 'divider',
  transition: 'border-color .2s, background-color .2s, transform .2s',
  '&:hover .reference-card-title': { color: 'secondary.main' },
  '&:hover': {
    borderColor: 'rgba(29,95,167,.55)',
    bgcolor: 'background.paper',
    transform: 'translateY(-2px)',
  },
} as const;

const metaSx = { display: 'flex', alignItems: 'center', gap: 1 } as const;
const titleSx = { mt: 1, fontSize: 'var(--site-text-2xl)', transition: 'color .2s' } as const;
const descriptionSx = { mt: 1.25, fontSize: '.9rem', maxWidth: '48ch' } as const;
const topicsSx = { mt: 'auto', pt: 2, display: 'flex', flexWrap: 'wrap', gap: 0.75 } as const;

export function ReferenceCard(props: ReferenceCardProps) {
  const { reference, headingLevel = 'h3' } = props;
  const t = useTranslations('Pages.achados');
  const { content, source } = useEditableContent(reference);

  return (
    <ScrollReveal>
      <Card
        component={NavLink}
        href={`/findings/${content.slug}`}
        underline="none"
        color="inherit"
        sx={cardSx}
      >
        <Box sx={metaSx}>
          <Typography variant="overline" color="secondary" {...getEditableProps(source, 'type')}>
            {t(`types.${toMessageKey(content.type)}`)}
          </Typography>
          {content.rating !== 'not-rated' && (
            <Typography variant="overline" color="text.disabled">
              · {t(`ratings.${toMessageKey(content.rating)}`)}
            </Typography>
          )}
        </Box>
        <Typography
          className="reference-card-title"
          component={headingLevel}
          {...getEditableProps(source, 'title')}
          variant="h3"
          sx={titleSx}
        >
          {content.title}
        </Typography>
        <Typography
          color="text.secondary"
          {...getEditableProps(source, 'description')}
          sx={descriptionSx}
        >
          {content.description}
        </Typography>
        {content.topics.length > 0 && (
          <Box sx={topicsSx}>
            {content.topics.slice(0, 3).map((topic) => (
              <Chip key={topic} label={topic} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </Card>
    </ScrollReveal>
  );
}
