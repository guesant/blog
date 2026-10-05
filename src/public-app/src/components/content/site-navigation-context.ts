import { createContext } from 'react';
import type { SiteText } from '@portfolio/data/domain/types';

export type SiteNavigation = NonNullable<SiteText['navigation']>;

export const SiteNavigationContext = createContext<SiteNavigation | null>(null);
