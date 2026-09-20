import type { SourcePreviewData } from './types';

export function handleSourcePreviewKindClick(
  onKindClick: ((data: SourcePreviewData) => void) | undefined,
  data: SourcePreviewData,
) {
  onKindClick?.(data);
}
