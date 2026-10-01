import type { ContentActionsTranslator } from '@/i18n/compat-support';
import type { SiteFeatureFlags } from '@portfolio/data/domain/types';

export type ContentActionsItemsProps = {
  text: string;
  copy: (value: string, kind: 'text' | 'url') => void;
  url: string;
  filename: string;
  t: ContentActionsTranslator;
  copied: string | null;
  featureFlags: SiteFeatureFlags['contentActions'];
  externalUrl?: string;
  downloadUrl?: string;
};
