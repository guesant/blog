'use client';

import { Button, Stack } from '../../../ui';
import type { HomeAvailabilityProps } from '../types';

export function HomeAvailability(props: HomeAvailabilityProps) {
  const { page, showContact } = props;

  if (!showContact) {
    return null;
  }
  return (
    <Stack
      direction="row"
      sx={{
        position: 'relative',
        zIndex: 1,
        mt: 'var(--site-space-3)',
        pb: 'var(--site-space-6)',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Button siteVariant="availability" size="small" variant="outlined">
        {page.availableLabel}
      </Button>
    </Stack>
  );
}
