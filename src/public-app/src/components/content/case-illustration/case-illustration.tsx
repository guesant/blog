import { Box, Svg, Typography } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { ScrollReveal } from '../../primitives/scroll-reveal';
import { TechnicalGrid } from '../../primitives/technical-grid';
import { getIllustrationAccent, type CaseIllustrationProps } from './types';
import { ArchitectureIllustration } from './architecture-illustration';
import { ProcessIllustration } from './process-illustration';
import { QueueIllustration } from './queue-illustration';

export function CaseIllustration(props: CaseIllustrationProps) {
  const t = useTranslations('Illustration');

  const accent = getIllustrationAccent(props.visual);

  let VisualComponent = QueueIllustration;
  if (props.visual === 'architecture') {
    VisualComponent = ArchitectureIllustration;
  }
  if (props.visual === 'process') {
    VisualComponent = ProcessIllustration;
  }

  return (
    <ScrollReveal>
      <Box
        visualVariant={props.compact ? 'caseIllustrationCompact' : 'caseIllustrationFull'}
        bgcolor={accent.bg}
        border={1}
        borderColor={`${accent.line}66`}
      >
        <TechnicalGrid variant="panel" />
        <Svg
          viewBox="0 0 400 300"
          width="100%"
          height="100%"
          role="img"
          aria-label={t('caseAria')}
          visualVariant="caseIllustration"
          children={<VisualComponent accent={accent} t={t} />}
        />
        <Typography variant="caption" visualVariant="caseIllustration">
          {t('conceptual')}
        </Typography>
      </Box>
    </ScrollReveal>
  );
}
