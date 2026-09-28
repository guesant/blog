'use client';

import type { HomeAvailabilityProps } from '../types';
import { AvailabilityButton } from '../../../ui/semantic/AvailabilityButton';
import { HomeAvailabilityStack } from '../../../ui/semantic/HomeAvailabilityStack';

export function HomeAvailability(props: HomeAvailabilityProps) {
  const { page, showAvailability } = props;

  if (!showAvailability) {
    return null;
  }
  return (
    <HomeAvailabilityStack direction="row">
      <AvailabilityButton size="small" variant="outlined">
        {page.availableLabel}
      </AvailabilityButton>
    </HomeAvailabilityStack>
  );
}
