'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { TechnologyBadge } from '@portfolio/content/types';
import { BrandGlyph } from '../primitives/brand-glyph';

const trackClass = 'technology-marquee-track';
const cloneClass = 'technology-marquee-clone';

const secondsPerItem = 3.2;
const minimumDuration = 24;

function marqueeDuration(itemCount: number) {
  return `${Math.max(minimumDuration, Math.round(itemCount * secondsPerItem))}s`;
}

const chipSx = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 1,
  flex: '0 0 auto',
  px: 1.5,
  py: 1,
  border: 1,
  borderColor: 'divider',
  borderRadius: '.375rem',
  bgcolor: 'rgba(255,255,255,.72)',
  color: 'text.secondary',
  fontSize: '.8125rem',
  fontWeight: 500,
  lineHeight: 1.2,
  whiteSpace: 'nowrap',
  transition: 'border-color .2s, color .2s, background-color .2s',
  '&:hover': {
    borderColor: 'rgba(29,95,167,.55)',
    color: 'text.primary',
    bgcolor: 'common.white',
  },
} as const;

const listSx = {
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  m: 0,
  p: 0,
  listStyle: 'none',
  flex: '0 0 auto',
} as const;

type TechnologyChipProps = {
  technology: TechnologyBadge;
};

function TechnologyChip(technologyChipProps: TechnologyChipProps) {
  const { technology } = technologyChipProps;

  return (
    <Box component="li" data-cursor-interactive sx={chipSx}>
      <BrandGlyph label={technology.name} logo={technology.logo} size={16} />
      {technology.name}
    </Box>
  );
}

type TechnologyMarqueeRowProps = {
  technologies: TechnologyBadge[];
  reverse?: boolean;
};

function TechnologyMarqueeRow(technologyMarqueeRowProps: TechnologyMarqueeRowProps) {
  const { technologies, reverse = false } = technologyMarqueeRowProps;
  if (technologies.length === 0) {
    return null;
  }

  const chips = technologies.map((technology) => (
    <TechnologyChip key={technology.slug} technology={technology} />
  ));

  return (
    <Box
      sx={{
        overflow: 'hidden',
        maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
        [`&:hover .${trackClass}`]: { animationPlayState: 'paused' },
        '@media (prefers-reduced-motion: reduce)': {
          maskImage: 'none',
          WebkitMaskImage: 'none',
          [`& .${trackClass}`]: { animation: 'none', width: '100%', flexWrap: 'wrap' },
          [`& .${cloneClass}`]: { display: 'none' },
        },
      }}
    >
      <Box
        className={trackClass}
        sx={{
          display: 'flex',
          width: 'max-content',
          gap: 1.5,
          animationName: 'technology-marquee-scroll',
          animationDuration: marqueeDuration(technologies.length),
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: reverse ? 'reverse' : 'normal',
          '@keyframes technology-marquee-scroll': {
            from: { transform: 'translate3d(0, 0, 0)' },
            to: { transform: 'translate3d(-50%, 0, 0)' },
          },
        }}
      >
        <Box component="ul" sx={listSx}>
          {chips}
        </Box>
        <Box component="ul" aria-hidden className={cloneClass} sx={listSx}>
          {chips}
        </Box>
      </Box>
    </Box>
  );
}

type EditableProps = Record<string, string | undefined>;

type TechnologyMarqueeProps = {
  technologies: TechnologyBadge[];
  label: string;
  labelEditableProps?: EditableProps;
};

export function TechnologyMarquee(technologyMarqueeProps: TechnologyMarqueeProps) {
  const { technologies, label, labelEditableProps } = technologyMarqueeProps;
  if (technologies.length === 0) {
    return null;
  }

  const leadingRow = technologies.filter((_, index) => index % 2 === 0);
  const trailingRow = technologies.filter((_, index) => index % 2 === 1);

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="overline" color="text.secondary" {...labelEditableProps}>
        {label}
      </Typography>
      <Box sx={{ mt: 2, display: 'grid', gap: 1.5 }}>
        <TechnologyMarqueeRow technologies={leadingRow} />
        <TechnologyMarqueeRow technologies={trailingRow} reverse />
      </Box>
    </Box>
  );
}
