import type { Project } from '@portfolio/data/domain/types';
import type { ProjectsTranslator } from '@/i18n/compat-support';

export function hasProjectOverview(project: Project) {
  return Boolean(project.problem || project.currentFocus);
}

export type ProjectOverviewProps = {
  project: Project;
  t: ProjectsTranslator;
};

export type ProjectDetailContentProps = { project: Project };
