import { ScrollReveal } from '../../primitives/scroll-reveal';
import { TechnicalGrid } from '../../primitives/technical-grid';
import { CaseIllustrationFullFrame } from '../../ui/semantic/CaseIllustrationFullFrame';
import { CaseIllustrationText } from '../../ui/semantic/CaseIllustrationText';
import type { CaseIllustrationVariantProps } from './case-illustration-variant';
import { CaseIllustrationVisual } from './case-illustration-visual';

export type CaseIllustrationFullProps = CaseIllustrationVariantProps;

export function CaseIllustrationFull(props: CaseIllustrationFullProps) {
  return (
    <ScrollReveal>
      <CaseIllustrationFullFrame accent={props.accent}>
        <TechnicalGrid variant="panel" />
        <CaseIllustrationVisual visual={props.visual} t={props.t} />
        <CaseIllustrationText variant="caption">{props.t('conceptual')}</CaseIllustrationText>
      </CaseIllustrationFullFrame>
    </ScrollReveal>
  );
}
