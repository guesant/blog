import { downloadFile } from './download-file';
import type { ContentActionsTranslator } from '@/i18n/compat-support';
import type { SiteFeatureFlags } from '@portfolio/data/domain/types';
import type { IconName } from '../primitives/icon';

export type ContentActionItem = {
  key: string;
  icon: IconName;
  label: string;
  onClick: () => void;
};

type BuildContentActionItemsProps = {
  text: string;
  copy: (value: string, kind: 'text' | 'url') => void;
  url: string;
  filename: string;
  t: ContentActionsTranslator;
  copied: string | null;
  featureFlags: SiteFeatureFlags['contentActions'];
};

export function buildContentActionItems(props: BuildContentActionItemsProps): ContentActionItem[] {
  const actions: Array<ContentActionItem & { enabled: boolean }> = [
    {
      enabled: props.featureFlags.copyText,
      key: 'copy-text',
      icon: props.copied === 'text' ? 'check' : 'copy',
      label: props.copied === 'text' ? props.t('copied') : props.t('copyText'),
      onClick: () => void props.copy(props.text, 'text'),
    },
    {
      enabled: props.featureFlags.copyUrl,
      key: 'copy-url',
      icon: props.copied === 'url' ? 'check' : 'external',
      label: props.copied === 'url' ? props.t('copied') : props.t('copyUrl'),
      onClick: () => void props.copy(window.location.origin + props.url, 'url'),
    },
    {
      enabled: props.featureFlags.downloadText,
      key: 'download-text',
      icon: 'download',
      label: props.t('downloadText'),
      onClick: () => downloadFile(props.filename + '.txt', props.text, 'text/plain;charset=utf-8'),
    },
  ];

  return actions.filter((action) => action.enabled).map(({ enabled, ...action }) => action);
}
