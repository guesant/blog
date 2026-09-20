import type { Reference } from '@portfolio/data/domain/types';
import { buildFindingEntry } from './build-finding-entry';
import type { FeedEntry } from './types';

export function buildFindingEntries(findings: Reference[]): FeedEntry[] {
  return findings.map(buildFindingEntry);
}
