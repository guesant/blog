import type { ReactNode } from 'react';
import { Box } from '../box';
import { Stack } from '../stack';
import { Typography } from '../typography';

type SidebarSectionFrameProps = { label: string; children: ReactNode };

const sectionStyles = { display: 'grid', gap: 'var(--site-sidebar-gap)' };

const contentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  flexShrink: 0,
  gap: 'var(--site-sidebar-gap)',
};

export function SidebarSectionFrame(props: SidebarSectionFrameProps) {
  return (
    <Box sx={sectionStyles}>
      <Typography variant="overline" color="text.secondary">
        {props.label}
      </Typography>
      <Stack sx={contentStyles}>{props.children}</Stack>
    </Box>
  );
}
