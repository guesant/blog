'use client';

import { ScrollReveal } from '../../primitives/scroll-reveal';
import type { HomeExperienceItemProps } from './types';
import { HomeExperienceDetails } from './ui/home-experience-details';
import { HomeExperienceItemSurface } from './ui/home-experience-item-surface';
import { HomeExperiencePeriod } from './ui/home-experience-period';

export function HomeExperienceItem(props: HomeExperienceItemProps) {
  const { item, index } = props;

  return (
    <ScrollReveal delay={index * 0.04}>
      <HomeExperienceItemSurface>
        <HomeExperiencePeriod>{item.period}</HomeExperiencePeriod>
        <HomeExperienceDetails item={item} />
      </HomeExperienceItemSurface>
    </ScrollReveal>
  );
}
