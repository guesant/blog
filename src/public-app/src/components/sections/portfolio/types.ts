import type { CaseStudy, PortfolioPageCopy, Profile } from '@portfolio/data/domain/types';
import type { Experiment, Project } from '@portfolio/data/domain/types';

export type PortfolioPageContentProps = {
  page: PortfolioPageCopy;
  profile: Profile;
  cases: CaseStudy[];
  projects: Project[];
  experiments: Experiment[];
};
