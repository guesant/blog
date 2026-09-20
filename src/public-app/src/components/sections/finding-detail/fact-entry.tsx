'use client';

import { Box, Typography } from '../../ui';
import type { DetailEntry } from './types';

type FactEntryProps = { entry: DetailEntry };

export function FactEntry(props: FactEntryProps) {
  const { entry } = props;

  return (
    <Box component="div" visualVariant="factEntry">
      <Typography component="dt" visualVariant="factEntry">
        {entry.label}
      </Typography>
      <Typography component="dd" visualVariant="factEntry2">
        {entry.value}
      </Typography>
    </Box>
  );
}
