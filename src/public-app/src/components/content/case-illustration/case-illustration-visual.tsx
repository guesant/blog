import type { IllustrationTranslator } from '@/i18n/compat-support';
import { ArchitectureCaseIllustration } from '../../ui/illustrations/architecture-case-illustration';
import { ProcessCaseIllustration } from '../../ui/illustrations/process-case-illustration';
import { QueueCaseIllustration } from '../../ui/illustrations/queue-case-illustration';
import type { CaseStudy } from '@portfolio/data/domain/types';

export type CaseIllustrationVisualProps = {
  visual: CaseStudy['visual'];
  t: IllustrationTranslator;
};

export function CaseIllustrationVisual(props: CaseIllustrationVisualProps) {
  if (props.visual === 'architecture') {
    return <ArchitectureCaseIllustration t={props.t} />;
  }

  if (props.visual === 'process') {
    return <ProcessCaseIllustration t={props.t} />;
  }

  return <QueueCaseIllustration t={props.t} />;
}
