import type { ReactNode } from 'react';
import { ConditionalContent } from '../../primitives/conditional-content';
import { Box } from '../box';
import { Divider } from '../divider';
import { Stack } from '../stack';
import { Typography } from '../typography';

type SidebarGroupFrameProps = { label?: string; children: ReactNode };

const stackStyles = { gap: 'var(--site-sidebar-gap)', marginTop: 'var(--site-sidebar-gap)' };

export function SidebarGroupFrame(props: SidebarGroupFrameProps) {
  return (
    <Box>
      <Divider sx={{ marginTop: 0, marginBottom: 'var(--site-sidebar-gap)' }} />
      <ConditionalContent
        condition={Boolean(props.label)}
        content={
          <Typography variant="overline" color="text.secondary">
            {props.label}
          </Typography>
        }
      />
      <Stack sx={stackStyles}>{props.children}</Stack>
    </Box>
  );
}
