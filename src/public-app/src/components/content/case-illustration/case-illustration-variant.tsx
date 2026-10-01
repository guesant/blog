import type { IllustrationTranslator } from '@/i18n/compat-support';
import type { CaseIllustrationProps, IllustrationAccent } from './types';
import { CaseIllustrationCompact } from './case-illustration-compact';
import { CaseIllustrationFull } from './case-illustration-full';

export type CaseIllustrationVariantProps = CaseIllustrationProps & {
  accent: IllustrationAccent;
  t: IllustrationTranslator;
};

export function CaseIllustrationVariant(props: CaseIllustrationVariantProps) {
  if (props.compact) {
    return <CaseIllustrationCompact {...props} />;
  }

  return <CaseIllustrationFull {...props} />;
}
