import type { SiteFeatureFlags } from '@portfolio/data/domain/types';

export type ContentActionsVisibilityOptions = {
  externalUrl?: string;
  downloadUrl?: string;
};

export function contentActionsAreVisible(
  contentActions: SiteFeatureFlags['contentActions'],
  options: ContentActionsVisibilityOptions = {},
) {
  return (
    Object.values(contentActions).some(Boolean) ||
    Boolean(options.externalUrl) ||
    Boolean(options.downloadUrl)
  );
}
