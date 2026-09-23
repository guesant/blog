'use client';

import type { AwardEntriesProps } from './types';
import { AwardEntryMeta } from './award-entry-meta';
import { ResumeEntryCollection } from './resume-entry-collection';

export function AwardEntries(props: AwardEntriesProps) {
  return <ResumeEntryCollection items={props.items} meta={AwardEntryMeta} />;
}
