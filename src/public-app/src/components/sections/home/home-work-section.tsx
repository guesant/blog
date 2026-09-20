'use client';

import { CaseShowcase } from '../../content/case-showcase';
import { SectionHeading } from '../../content/section-heading';
import { ScrollReveal } from '../../primitives/scroll-reveal';
import type { HomeWorkSectionProps } from './types';
import { HomeSectionSurface } from './ui/home-section-surface';

export function HomeWorkSection(props: HomeWorkSectionProps) {
  const { cases, page, t } = props;

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
        <CaseShowcase cases={cases} />
      </ScrollReveal>
    </HomeSectionSurface>
  );
}
