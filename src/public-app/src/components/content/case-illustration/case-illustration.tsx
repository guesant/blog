import { ArchitectureCaseIllustration } from '../../ui/illustrations/architecture-case-illustration';
import { ProcessCaseIllustration } from '../../ui/illustrations/process-case-illustration';
import { QueueCaseIllustration } from '../../ui/illustrations/queue-case-illustration';
import { CaseIllustrationCompactFrame } from '../../ui/semantic/CaseIllustrationCompactFrame';
import { CaseIllustrationFullFrame } from '../../ui/semantic/CaseIllustrationFullFrame';
import { useTranslations } from '@/i18n/compat';
import { ScrollReveal } from '../../primitives/scroll-reveal';
import { TechnicalGrid } from '../../primitives/technical-grid';
import type { CaseIllustrationProps } from './types';
import { getIllustrationAccent } from './types';
import { CaseIllustrationText } from '../../ui/semantic/CaseIllustrationText';

const illustrationByVisual = {
  architecture: ArchitectureCaseIllustration,
  process: ProcessCaseIllustration,
  queue: QueueCaseIllustration,
} satisfies Record<CaseIllustrationProps['visual'], typeof ArchitectureCaseIllustration>;

export function CaseIllustration(props: CaseIllustrationProps) {
  const t = useTranslations('Illustration');

  const accent = getIllustrationAccent(props.visual);

  const Frame = props.compact ? CaseIllustrationCompactFrame : CaseIllustrationFullFrame;

  const Illustration = illustrationByVisual[props.visual];

  return (
    <ScrollReveal>
      <Frame accent={accent}>
        <TechnicalGrid variant="panel" />
        <Illustration t={t} />
        <CaseIllustrationText variant="caption">{t('conceptual')}</CaseIllustrationText>
      </Frame>
    </ScrollReveal>
  );
}
