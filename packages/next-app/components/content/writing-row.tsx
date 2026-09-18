'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { Writing } from '@portfolio/content/types';
import { useLocale } from 'next-intl';
import { Icon } from '../primitives/icon';
import { LayoutStack as Stack } from '../primitives/layout-stack';
import { NavLink } from '../primitives/nav-link';
import { ScrollReveal } from '../primitives/scroll-reveal';

type WritingRowProps = { writing: Writing };

const rowSx = {
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: { xs: 2, md: 4 },
  py: { xs: 3, md: 4 },
  borderTop: 1,
  borderColor: 'divider',
  '&:hover .writing-title': { color: 'secondary.main' },
} as const;

const metaSx = { gap: 1, mb: 1 } as const;

const titleSx = {
  fontWeight: 600,
  lineHeight: 1.3,
  mb: 1,
  maxWidth: '34ch',
  transition: 'color .2s',
  fontSize: { xs: '1.2rem', md: '1.4rem' },
} as const;

const excerptSx = { maxWidth: '52ch' } as const;

const arrowStyle = { marginTop: '0.25rem', color: 'rgba(0,0,0,.6)' } as const;

export function WritingRow(props: WritingRowProps) {
  const { writing } = props;
  const locale = useLocale();
  const { content, source } = useEditableContent(writing);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(content.dateISO));

  return (
    <ScrollReveal>
      <NavLink href={`/writing/${content.slug}`} underline="none" color="inherit" sx={rowSx}>
        <Box>
          <Stack direction="row" sx={metaSx}>
            <Typography variant="overline" color="secondary" {...getEditableProps(source, 'type')}>
              {[content.language?.toUpperCase(), content.type].filter(Boolean).join(' · ')}
            </Typography>
            <Typography variant="overline" color="text.disabled">
              · {content.subject}
            </Typography>
          </Stack>
          <Typography className="writing-title" {...getEditableProps(source, 'title')} sx={titleSx}>
            {content.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            {...getEditableProps(source, 'excerpt')}
            sx={excerptSx}
          >
            {content.excerpt}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {content.readingTime} · {formattedDate}
          </Typography>
        </Box>
        <Icon name="arrow" size={20} style={arrowStyle} />
      </NavLink>
    </ScrollReveal>
  );
}
