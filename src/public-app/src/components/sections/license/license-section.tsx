import { Box, Typography } from '../../ui';
import type { LicenseSectionProps } from './types';

export function LicenseSection(props: LicenseSectionProps) {
  const { heading, children } = props;

  return (
    <Box component="section" visualVariant="licenseSection">
      <Typography component="h2" variant="h5" visualVariant="licenseSection">
        {heading}
      </Typography>
      <Typography color="text.secondary" visualVariant="licenseSection2">
        {children}
      </Typography>
    </Box>
  );
}
