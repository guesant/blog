import type { Experiment, Project, ProjectsPageCopy } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';

export type ExperimentRowProps = { item: Experiment };

export type ProjectRowProps = { item: Project };

export type ExperimentsSectionProps = {
  experiments: Experiment[];
  hasProjects: boolean;
  page: ProjectsPageCopy;
  tCommon: ReturnType<typeof useTranslations>;
};

export type ProjectsPageContentProps = {
  page: ProjectsPageCopy;
  projects: Project[];
  experiments: Experiment[];
};
