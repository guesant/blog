'use client';

import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import type { ProjectsPageContentProps } from './types';
import { ProjectsPageBody } from './projects-page-body';

export function ProjectsPageContent(props: ProjectsPageContentProps) {
  const { page: staticPage, projects, experiments } = props;

  const page = staticPage;

  const tCommon = useTranslations('Common');

  const tNav = useTranslations('Nav');

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        breadcrumbs={[{ label: tNav('projects') }]}
        description={page.description}
      />
      <ProjectsPageBody
        page={page}
        projects={projects}
        experiments={experiments}
        tCommon={tCommon}
      />
    </>
  );
}
