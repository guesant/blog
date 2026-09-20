'use client';

import { Box, Typography } from '../../ui';

type CaseFactProps = {
  label: string;
  value: string;
  field: string;
};

export function CaseFact(props: CaseFactProps) {
  const { label, value } = props;

  return (
    <Box>
      <Typography visualVariant="caseFact">{label}</Typography>
      <Typography visualVariant="caseFact2">{value}</Typography>
    </Box>
  );
}
