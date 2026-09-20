import { nonEmpty } from './source-preview-non-empty';
import type { SourcePreviewMetadata, SourcePreviewMetadataKey } from './types';

export function metadata(
  key: SourcePreviewMetadataKey,
  value: unknown,
): SourcePreviewMetadata | undefined {
  const normalized = nonEmpty(value);

  return normalized ? { key, value: normalized } : undefined;
}
