'use client';

import type { TechnicalProductionEntriesProps } from './types';
import { ResumeEntryCollection } from './resume-entry-collection';
import { TechnicalProductionEntryMeta } from './technical-production-entry-meta';

export function TechnicalProductionEntries(props: TechnicalProductionEntriesProps) {
  return <ResumeEntryCollection items={props.items} meta={TechnicalProductionEntryMeta} />;
}
