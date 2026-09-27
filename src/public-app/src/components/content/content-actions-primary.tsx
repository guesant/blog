import type { ContentActionsTranslator } from '@/i18n/compat-support';
import type { SiteFeatureFlags } from '@portfolio/data/domain/types';
import { ContentActionButton } from './content-action-button';
import { buildContentActionItems } from './build-content-action-items';

type ContentActionsPrimaryProps = {
  text: string;
  copy: (value: string, kind: 'text' | 'url') => void;
  url: string;
  filename: string;
  t: ContentActionsTranslator;
  copied: string | null;
  featureFlags: SiteFeatureFlags['contentActions'];
};

export function ContentActionsPrimary(props: ContentActionsPrimaryProps) {
  return buildContentActionItems(props).map((action) => (
    <ContentActionButton
      key={action.key}
      icon={action.icon}
      label={action.label}
      onClick={action.onClick}
    />
  ));
}
