import { sourcePreviewFirstValue } from './source-preview-first-value';

export function sourcePreviewFirstText(values: Array<string | undefined>): string {
  return sourcePreviewFirstValue(values) ?? '';
}
