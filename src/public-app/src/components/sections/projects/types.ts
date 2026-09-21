import type { Experiment, Project, ProjectsPageCopy } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';
import { useTranslations } from '@/i18n/compat';

export type ExperimentRowProps = { item: Experiment };

export type ProjectRowProps = { item: Project };

export type ExperimentsSectionProps = {
  experiments: Experiment[];
  pagination: ContentCollectionMeta;
  hasProjects: boolean;
  page: ProjectsPageCopy;
  tCommon: ReturnType<typeof useTranslations>;
};

export type ProjectsPageContentProps = {
  page: ProjectsPageCopy;
  projects: Project[];
  projectsPagination: ContentCollectionMeta;
  experiments: Experiment[];
  experimentsPagination: ContentCollectionMeta;
};
