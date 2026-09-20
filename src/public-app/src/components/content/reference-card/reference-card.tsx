'use client';

import { ScrollReveal } from '../../primitives/scroll-reveal';
import type { ReferenceCardProps } from './types';
import { ReferenceCardSurface } from './reference-card-surface';

export function ReferenceCard(props: ReferenceCardProps) {
  return (
    <ScrollReveal>
      <ReferenceCardSurface {...props} />
    </ScrollReveal>
  );
}
