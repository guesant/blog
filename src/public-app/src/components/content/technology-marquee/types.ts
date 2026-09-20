import type { TechnologyBadge } from '@portfolio/data/domain/types';

export const trackClass = 'technology-marquee-track';

export const cloneClass = 'technology-marquee-clone';

const secondsPerItem = 3.2;

const minimumDuration = 24;

export function marqueeDuration(itemCount: number) {
  return `${Math.max(minimumDuration, Math.round(itemCount * secondsPerItem))}s`;
}

export type TechnologyChipProps = {
  technology: TechnologyBadge;
};

export type TechnologyMarqueeRowProps = {
  technologies: TechnologyBadge[];
  reverse?: boolean;
};

export type TechnologyMarqueeProps = {
  technologies: TechnologyBadge[];
  label: string;
};
