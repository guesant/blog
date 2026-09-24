'use client';

import { useTranslations } from '@/i18n/compat';
import { DetailArticle, MetricsGrid } from '../../content/detail-layout';
import { ContentActions } from '../../content/content-actions';
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

  return (
    <DetailArticle>
      <DetailHeader
        breadcrumbs={[{ label: tNav('projects'), href: '/projects' }, { label: project.name }]}
        eyebrow={t('projectEyebrow')}
        title={project.name}
        description={project.purpose}
        meta={project.status}
        actions={
          <ContentActions
            title={project.name}
            url={project.url ?? `/projects/${project.slug}`}
            body={project.body}
            externalUrl={project.href}
            placement="hero"
          />
        }
      />

      <ProjectOverview project={project} t={t} />

      <MetricsGrid metrics={project.metrics} marginTop={6} />

      <ProjectDetailMetadata project={project} t={t} />
      <ProjectDetailBody body={project.body} />
    </DetailArticle>
  );
}
