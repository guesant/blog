'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { Project } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { DetailArticle, MetricsGrid } from '../content/detail-layout';
import { DetailHeader } from '../content/page-header';
import { ExternalLink } from '../primitives/external-link';

function hasProjectOverview(project: Project) {
  return Boolean(project.problem || project.currentFocus);
}

type EditableSource = Record<string, unknown>;
type ProjectOverviewProps = {
  project: Project;
  source: EditableSource;
  t: ReturnType<typeof useTranslations>;
};

function ProjectOverview(props: ProjectOverviewProps) {
  const { project, source, t } = props;
  if (!hasProjectOverview(project)) {
    return null;
  }
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
        gap: 3,
        mt: 6,
        pt: 4,
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      {project.problem && (
        <Box>
          <Typography variant="overline" color="text.secondary">
            {t('problem')}
          </Typography>
          <Typography {...getEditableProps(source, 'problem')} sx={{ mt: 1 }}>
            {project.problem}
          </Typography>
        </Box>
      )}
      {project.currentFocus && (
        <Box>
          <Typography variant="overline" color="text.secondary">
            {t('currentFocus')}
          </Typography>
          <Typography {...getEditableProps(source, 'currentFocus')} sx={{ mt: 1 }}>
            {project.currentFocus}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

type ProjectDetailContentProps = { project: Project };

export function ProjectDetailContent(props: ProjectDetailContentProps) {
  const { project: staticProject } = props;
  const t = useTranslations('Pages.projects');
  const tNav = useTranslations('Nav');
  const { content: project, source, raw } = useEditableContent(staticProject);

  return (
    <DetailArticle>
      <DetailHeader
        backHref="/projects"
        backLabel={t('back')}
        breadcrumbs={[{ label: tNav('projects'), href: '/projects' }, { label: project.name }]}
        eyebrow={t('projectEyebrow')}
        title={project.name}
        description={project.purpose}
        meta={project.status}
        editableProps={{
          title: getEditableProps(source, 'name'),
          description: getEditableProps(source, 'purpose'),
          meta: getEditableProps(source, 'status'),
        }}
      />

      <ProjectOverview project={project} source={source} t={t} />

      <MetricsGrid
        metrics={project.metrics}
        marginTop={6}
        editableProps={getEditableProps(source, 'metrics')}
      />

      {(project.technologies.length > 0 || project.href?.trim()) && (
        <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider' }}>
          {project.technologies.length > 0 && (
            <>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                {t('technologies')}
              </Typography>
              <Typography
                color="text.secondary"
                {...getEditableProps(raw, 'technologies')}
                sx={{ mb: 4 }}
              >
                {project.technologies.join(' · ')}
              </Typography>
            </>
          )}
          {project.href?.trim() && (
            <ExternalLink
              href={project.href}
              underline="none"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontWeight: 600 }}
            >
              {t('source')}
            </ExternalLink>
          )}
        </Box>
      )}
    </DetailArticle>
  );
}
