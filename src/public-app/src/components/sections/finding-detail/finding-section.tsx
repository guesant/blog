'use client';

import { Box, Typography } from '../../ui';
import type { ReactNode } from 'react';

type FindingSectionProps = { title: string; children: ReactNode };

export function FindingSection(props: FindingSectionProps) {
  return (
    <Box component="section" visualVariant="findingSection">
      <Typography component="h2" visualVariant="findingSection">
        {props.title}
      </Typography>
      {props.children}
    </Box>
  );
}
