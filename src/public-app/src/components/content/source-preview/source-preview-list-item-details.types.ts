import type { SourcePreviewData, SourcePreviewTranslator } from './types';
import type { SourcePreviewVariant } from './source-preview-variant';

export type SourcePreviewListItemDetailsProps = {
  data: SourcePreviewData;
  onKindClick?: (data: SourcePreviewData) => void;
  t?: SourcePreviewTranslator;
  variant: SourcePreviewVariant;
};
