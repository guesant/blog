import { multilineTools, calculationTools } from './legacy-tool-support';

export function isMultiline(slug: string) {
  return multilineTools.has(slug) || !calculationTools.has(slug);
}
