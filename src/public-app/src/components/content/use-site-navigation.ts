'use client';

import { useContext } from 'react';
import { SiteNavigationContext } from './site-navigation-context';

export function useSiteNavigation() {
  const value = useContext(SiteNavigationContext);

  if (value === null) {
    throw new Error('useSiteNavigation must be used inside SiteNavigationProvider');
  }

  return value;
}
