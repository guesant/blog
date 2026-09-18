'use client';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { Project } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { Icon } from '../primitives/icon';
import { NavLink } from '../primitives/nav-link';
import { ScrollReveal } from '../primitives/scroll-reveal';

type ProjectCardProps = { project: Project; highlighted?: boolean; headingLevel?: 'h2' | 'h3' };

const baseCardSx = {
  minHeight: '17rem',
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  transition: 'border-color .2s, background-color .2s, transform .2s',
  '&:hover .project-card-title': { color: 'secondary.main' },
} as const;

const cardSx = {
  highlighted: {
    ...baseCardSx,
    bgcolor: '#EAF2FA',
    borderColor: 'rgba(29,95,167,.28)',
    '&:hover': {
      borderColor: 'rgba(29,95,167,.55)',
      bgcolor: '#E1EDF8',
      transform: 'translateY(-2px)',
    },
  },
  plain: {
    ...baseCardSx,
    bgcolor: 'rgba(255,255,255,.72)',
    borderColor: 'divider',
    '&:hover': {
      borderColor: 'rgba(29,95,167,.55)',
      bgcolor: 'background.paper',
      transform: 'translateY(-2px)',
    },
  },
} as const;

const titleSx = { mt: 1.5, fontSize: '1.25rem', transition: 'color .2s' } as const;
const purposeSx = { mt: 1.25, fontSize: '.9rem', maxWidth: '48ch' } as const;
const problemSx = { mt: 2, fontSize: '.85rem' } as const;
const techSx = { mt: 'auto', pt: 3, color: 'text.secondary', fontSize: '.8rem' } as const;
const exploreSx = {
  mt: 2,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.75,
  fontWeight: 600,
} as const;

export function ProjectCard(props: ProjectCardProps) {
  const { project, highlighted = false, headingLevel = 'h3' } = props;
  const t = useTranslations('Common');
  const { content, source, raw } = useEditableContent(project);

  return (
    <ScrollReveal>
      <Card
        component={NavLink}
        href={`/projects/${content.slug}`}
        underline="none"
        color="inherit"
        sx={highlighted ? cardSx.highlighted : cardSx.plain}
      >
        <Typography
          variant="overline"
          color="text.secondary"
          {...getEditableProps(source, 'status')}
        >
          {content.status}
        </Typography>
        <Typography
          className="project-card-title"
          component={headingLevel}
          {...getEditableProps(source, 'name')}
          variant="h3"
          sx={titleSx}
        >
          {content.name}
        </Typography>
        <Typography color="text.secondary" {...getEditableProps(source, 'purpose')} sx={purposeSx}>
          {content.purpose}
        </Typography>
        {content.problem && (
          <Typography {...getEditableProps(source, 'problem')} sx={problemSx}>
            {content.problem}
          </Typography>
        )}
        <Typography {...getEditableProps(raw, 'technologies')} sx={techSx}>
          {content.technologies.join(' · ')}
        </Typography>
        <Typography color="secondary" sx={exploreSx}>
          {t('explore')} <Icon name="north-east" size={15} />
        </Typography>
      </Card>
    </ScrollReveal>
  );
}
