import { useTranslations } from '@/i18n/compat';
import { getIllustrationAccent, type CaseIllustrationProps } from './types';
import { CaseIllustrationVariant } from './case-illustration-variant';

export function CaseIllustration(props: CaseIllustrationProps) {
  const t = useTranslations('Illustration');

  const accent = getIllustrationAccent(props.visual);

  return <CaseIllustrationVariant {...props} accent={accent} t={t} />;
}
