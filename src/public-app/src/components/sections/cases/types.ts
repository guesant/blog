import type { CaseStudy, PageIntroduction } from '@portfolio/data/domain/types';

export type CaseCardProps = { item: CaseStudy };

export type CasesPageContentProps = { page: PageIntroduction; items: CaseStudy[] };
