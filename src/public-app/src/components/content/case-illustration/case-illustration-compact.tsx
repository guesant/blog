import { ScrollReveal } from '../../primitives/scroll-reveal';
import { TechnicalGrid } from '../../primitives/technical-grid';
import { CaseIllustrationCompactFrame } from '../../ui/semantic/CaseIllustrationCompactFrame';
import { CaseIllustrationText } from '../../ui/semantic/CaseIllustrationText';
import type { CaseIllustrationVariantProps } from './case-illustration-variant';
import { CaseIllustrationVisual } from './case-illustration-visual';

export type CaseIllustrationCompactProps = CaseIllustrationVariantProps;

export function CaseIllustrationCompact(props: CaseIllustrationCompactProps) {
  return (
    <ScrollReveal>
      <CaseIllustrationCompactFrame accent={props.accent}>
        <TechnicalGrid variant="panel" />
        <CaseIllustrationVisual visual={props.visual} t={props.t} />
        <CaseIllustrationText variant="caption">{props.t('conceptual')}</CaseIllustrationText>
      </CaseIllustrationCompactFrame>
    </ScrollReveal>
  );
}
