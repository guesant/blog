import type { CaseStudy, PortfolioPageCopy, Profile } from '@portfolio/data/domain/types';
import type { Experiment, Project } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

export type PortfolioPageContentProps = {
  page: PortfolioPageCopy;
  profile: Profile;
  cases: CaseStudy[];
  casesPagination: ContentCollectionMeta;
  projects: Project[];
  projectsPagination: ContentCollectionMeta;
  experiments: Experiment[];
  experimentsPagination: ContentCollectionMeta;
};
