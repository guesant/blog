'use client';

import { useContext } from 'react';
import type { SiteFeatureFlags } from '@portfolio/data/domain/types';
import { SiteFeatureFlagsContext } from './site-feature-flags-context';

export function useSiteFeatureFlags(): SiteFeatureFlags {
  const value = useContext(SiteFeatureFlagsContext);

  if (value === null) {
    throw new Error('useSiteFeatureFlags must be used inside SiteFeatureFlagsProvider');
  }

  return value;
}
