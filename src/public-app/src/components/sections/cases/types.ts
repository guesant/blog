import type { CaseStudy, PageIntroduction } from '@portfolio/data/domain/types';
import type { ContentCollectionMeta } from '@portfolio/data/api/public-site-source-support';

export type CaseCardProps = { item: CaseStudy };

export type CasesPageContentProps = {
  page: PageIntroduction;
  items: CaseStudy[];
  pagination: ContentCollectionMeta;
};
