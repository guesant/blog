import { createContext } from 'react';
import type { SiteText } from '@portfolio/data/domain/types';

export type SiteNavigation = NonNullable<SiteText['navigation']> & {
  visibility?: SiteText['visibility'];
};

export const SiteNavigationContext = createContext<SiteNavigation | null>(null);
