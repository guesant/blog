import type { IconName } from '../../primitives/icon';
import type { SourcePreviewTranslationKey } from '@/i18n/compat-support';

type SourcePreviewKind =
  'repository' | 'organization' | 'user' | 'video' | 'playlist' | 'channel' | 'link';

export type SourcePreviewMetadataKey = 'host';

export type SourcePreviewMetadata = {
  key: SourcePreviewMetadataKey;
  value: string;
};

export type SourcePreviewData = {
  provider: 'github' | 'youtube' | 'generic';
  kind: SourcePreviewKind;
  url: string;
  title: string;
  description: string;
  icon: IconName;
  metadata: SourcePreviewMetadata[];
  filterType?: string;
};

export type SourcePreviewTranslator = (
  key: SourcePreviewTranslationKey,
  values?: Record<string, string | number>,
) => string;
