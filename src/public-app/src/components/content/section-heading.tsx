import { ScrollReveal } from '../primitives/scroll-reveal';
import { SectionHeadingContent } from './section-heading-content';
import type { SectionHeadingProps } from './section-heading.types';

export function SectionHeading(props: SectionHeadingProps) {
  return (
    <ScrollReveal>
      <SectionHeadingContent {...props} />
    </ScrollReveal>
  );
}
