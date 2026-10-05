'use client';

import { useTranslations } from '@/i18n/compat';
import { DetailArticle, MetricsGrid } from '../../content/detail-layout';
import { ContentActions } from '../../content/content-actions';
import { useContentActionsVisibility } from '../../content/use-content-actions-visibility';
import { DetailHeader } from '../../content/page-header';
import type { ProjectDetailContentProps } from './types';
import { ProjectOverview } from './project-overview';
import { ProjectDetailBody } from './project-detail-body';
import { ProjectDetailMetadata } from './project-detail-metadata';

export function ProjectDetailContent(props: ProjectDetailContentProps) {
  const { project: staticProject } = props;

  const t = useTranslations('Pages.projects');

  const tNav = useTranslations('Nav');

  const project = staticProject;

  const actionsVisible = useContentActionsVisibility({ externalUrl: project.href });

  return (
    <DetailArticle>
      <DetailHeader
        breadcrumbs={[{ label: tNav('projects'), href: '/projects' }, { label: project.name }]}
        title={project.name}
        description={project.purpose}
        meta={project.status}
        actions={
          actionsVisible ? (
            <ContentActions
              title={project.name}
              url={project.url ?? `/projects/${project.slug}`}
              body={project.body}
              externalUrl={project.href}
              placement="hero"
            />
          ) : undefined
        }
      />

      <ProjectOverview project={project} t={t} />

      <MetricsGrid metrics={project.metrics} />

      <ProjectDetailMetadata project={project} t={t} />
      <ProjectDetailBody body={project.body} />
    </DetailArticle>
  );
}
