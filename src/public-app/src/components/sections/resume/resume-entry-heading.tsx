'use client';

import type { ResumeEntryHeadingProps } from './types';
import { EditableItemName } from './editable-item-name';
import { ResumeEntryGrid } from './resume-entry-grid';
import { EntryPeriod } from './entry-period';

export function ResumeEntryHeading(props: ResumeEntryHeadingProps) {
  return (
    <ResumeEntryGrid>
      <EditableItemName item={props.item} />
      <EntryPeriod period={props.item.period} />
      {props.children}
    </ResumeEntryGrid>
  );
}
