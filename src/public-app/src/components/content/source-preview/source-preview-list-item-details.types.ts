import type { SourcePreviewData, SourcePreviewTranslator } from './types';

export type SourcePreviewListItemDetailsProps = {
  data: SourcePreviewData;
  onKindClick?: (data: SourcePreviewData) => void;
  t?: SourcePreviewTranslator;
};
