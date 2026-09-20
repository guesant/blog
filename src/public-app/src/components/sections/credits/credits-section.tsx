import { Box, Typography } from '../../ui';
import type { CreditsSectionProps } from './types';

export function CreditsSection(props: CreditsSectionProps) {
  const { heading, maxWidth = '60ch', children } = props;

  return (
    <Box
      component="section"
      visualVariant={maxWidth === 'none' ? 'creditsSectionFull' : 'creditsSection'}
    >
      <Typography component="h2" variant="h5" visualVariant="creditsSection">
        {heading}
      </Typography>
      {children}
    </Box>
  );
}
