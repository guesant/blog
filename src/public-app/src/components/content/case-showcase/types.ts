import type { CaseStudy } from '@portfolio/data/domain/types';

export type CaseLinkProps = { item: CaseStudy; compact?: boolean };

export type CaseShowcaseProps = { cases: CaseStudy[] };
