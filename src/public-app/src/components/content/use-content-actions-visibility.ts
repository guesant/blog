'use client';

import { useSiteFeatureFlags } from './use-site-feature-flags';
import {
  contentActionsAreVisible,
  type ContentActionsVisibilityOptions,
} from './content-actions-visibility';

export function useContentActionsVisibility(options: ContentActionsVisibilityOptions = {}) {
  const featureFlags = useSiteFeatureFlags();

  return contentActionsAreVisible(featureFlags.contentActions, options);
}
