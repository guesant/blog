import { createContext } from 'react';
import type { SiteFeatureFlags } from '@portfolio/data/domain/types';

export const SiteFeatureFlagsContext = createContext<SiteFeatureFlags | null>(null);
