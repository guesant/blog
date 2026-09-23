'use client';

import { CaseShowcase } from '../../content/case-showcase';
import { SectionHeading } from '../../content/section-heading';
import { ScrollReveal } from '../../primitives/scroll-reveal';
import type { HomeWorkSectionProps } from './types';
import { HomeSectionSurface } from './ui/home-section-surface';
import { useProgressiveCollection } from '../../../data/queries/use-progressive-collection';
import { ProgressiveCollectionFooter } from '../../content/progressive-collection/progressive-collection-footer';

export function HomeWorkSection(props: HomeWorkSectionProps) {
  const { cases, casesPagination, page, t } = props;

  const progressive = useProgressiveCollection({
    collection: 'cases',
    query: { featured: true, perPage: 3 },
    initialPage: { items: cases, meta: casesPagination },
    queryKey: ['home', 'cases'],
    getKey: (item) => item.slug,
  });

  return (
    <HomeSectionSurface id="work" work>
      <SectionHeading
        eyebrow={page.workEyebrow}
        title={page.workTitle}
        description={page.workDescription}
        href="/cases"
        linkLabel={t('workAction')}
      />
      <ScrollReveal>
        <CaseShowcase cases={progressive.items} />
        <ProgressiveCollectionFooter progressive={progressive} />
      </ScrollReveal>
    </HomeSectionSurface>
  );
}
