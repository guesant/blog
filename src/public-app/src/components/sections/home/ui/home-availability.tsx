'use client';

import { Button, Stack } from '../../../ui';
import type { HomeAvailabilityProps } from '../types';

export function HomeAvailability(props: HomeAvailabilityProps) {
  const { page, showContact } = props;

  if (!showContact) {
    return null;
  }
  return (
    <Stack direction="row" visualVariant="homeAvailability">
      <Button siteVariant="availability" size="small" variant="outlined">
        {page.availableLabel}
      </Button>
    </Stack>
  );
}
