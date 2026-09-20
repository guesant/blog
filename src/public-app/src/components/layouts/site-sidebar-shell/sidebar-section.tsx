'use client';

import { Box, Typography } from '../../ui';
import { Stack } from '../../ui';
import type { ReactNode } from 'react';

type SidebarSectionProps = { label: string; children: ReactNode };

export function SidebarSection(props: SidebarSectionProps) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" visualVariant="sidebarSection">
        {props.label}
      </Typography>
      <Stack visualVariant="sidebarSection">{props.children}</Stack>
    </Box>
  );
}
