import type { Project } from '@portfolio/data/domain/types';
import { useTranslations } from '@/i18n/compat';

export function hasProjectOverview(project: Project) {
  return Boolean(project.problem || project.currentFocus);
}

export type ProjectOverviewProps = {
  project: Project;
  t: ReturnType<typeof useTranslations>;
};

export type ProjectDetailContentProps = { project: Project };
