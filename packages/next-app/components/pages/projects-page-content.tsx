'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { getEditableProps, useEditableContent } from '@portfolio/content/editing';
import type { Experiment, Project, ProjectsPageCopy } from '@portfolio/content/types';
import { useTranslations } from 'next-intl';
import { EmptyState } from '../content/empty-state';
import { PageHeader } from '../content/page-header';
import { ProjectCard } from '../content/project-card';
import { NavLink } from '../primitives/nav-link';

type ExperimentRowProps = { item: Experiment };

function ExperimentRow(props: ExperimentRowProps) {
  const { item: staticItem } = props;
  const t = useTranslations('Common');
  const { content: item, source } = useEditableContent(staticItem);
  return (
    <NavLink
      href={`/projects/experiments/${item.slug}`}
      underline="none"
      color="inherit"
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 2,
        py: 2.5,
        borderTop: 1,
        borderColor: 'divider',
        '&:hover .experiment-title': { color: 'secondary.main' },
      }}
    >
      <Box>
        <Typography
          className="experiment-title"
          variant="subtitle2"
          component="h3"
          {...getEditableProps(source, 'name')}
          sx={{ fontWeight: 600, mb: 0.5 }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          {...getEditableProps(source, 'purpose')}
          sx={{ maxWidth: '56ch' }}
        >
          {item.purpose}
        </Typography>
      </Box>
      <Typography color="text.secondary">{t('arrow')}</Typography>
    </NavLink>
  );
}

type ExperimentsSectionProps = {
  experiments: Experiment[];
  hasProjects: boolean;
  page: ProjectsPageCopy;
  source: Record<string, unknown>;
  tCommon: ReturnType<typeof useTranslations>;
};

function ExperimentsSection(props: ExperimentsSectionProps) {
  const { experiments, hasProjects, page, source, tCommon } = props;
  if (experiments.length === 0) {
    return hasProjects ? (
      <EmptyState icon="problem">{tCommon('emptyExperiments')}</EmptyState>
    ) : null;
  }

  return (
    <>
      <Typography
        id="experiments"
        variant="overline"
        color="text.secondary"
        {...getEditableProps(source, 'archiveLabel')}
        sx={{ display: 'block', mb: 1.5, scrollMarginTop: '6rem' }}
      >
        {page.archiveLabel}
      </Typography>
      <Typography
        component="h2"
        variant="h5"
        {...getEditableProps(source, 'experimentsTitle')}
        sx={{ fontWeight: 600, mb: 3 }}
      >
        {page.experimentsTitle}
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        {experiments.map((item) => (
          <ExperimentRow key={item.slug} item={item} />
        ))}
      </Box>
    </>
  );
}

type ProjectsPageContentProps = {
  page: ProjectsPageCopy;
  projects: Project[];
  experiments: Experiment[];
};

export function ProjectsPageContent(props: ProjectsPageContentProps) {
  const { page: staticPage, projects, experiments } = props;
  const { content: page, source } = useEditableContent(staticPage);
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Nav');
  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        breadcrumbs={[{ label: tNav('projects') }]}
        description={page.description}
        editableProps={{
          eyebrow: getEditableProps(source, 'eyebrow'),
          title: getEditableProps(source, 'title'),
          description: getEditableProps(source, 'description'),
        }}
      />
      {projects.length > 0 && (
        <Typography
          variant="overline"
          color="text.secondary"
          {...getEditableProps(source, 'selectedLabel')}
          sx={{ display: 'block', mb: 2 }}
        >
          {page.selectedLabel}
        </Typography>
      )}
      {projects.length === 0 ? (
        <EmptyState icon="problem">{tCommon('emptyProjects')}</EmptyState>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: 2,
            mb: { xs: 9, md: 11 },
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} headingLevel="h2" />
          ))}
        </Box>
      )}
      <ExperimentsSection
        experiments={experiments}
        hasProjects={projects.length > 0}
        page={page}
        source={source}
        tCommon={tCommon}
      />
    </>
  );
}
