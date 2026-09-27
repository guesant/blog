'use client';

import type { ReactNode } from 'react';
import type { SiteFeatureFlags } from '@portfolio/data/domain/types';
import { SiteFeatureFlagsContext } from './site-feature-flags-context';

type SiteFeatureFlagsProviderProps = { value: SiteFeatureFlags; children: ReactNode };

export function SiteFeatureFlagsProvider(props: SiteFeatureFlagsProviderProps) {
  return (
    <SiteFeatureFlagsContext.Provider value={props.value}>
      {props.children}
    </SiteFeatureFlagsContext.Provider>
  );
}
