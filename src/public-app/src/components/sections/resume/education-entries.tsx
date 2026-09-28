'use client';

import { ResumeEntryCollectionFrame } from '../../ui';
import type { EducationEntriesProps } from './types';
import { EducationEntry } from './education-entry';

export function EducationEntries(props: EducationEntriesProps) {
  const { items } = props;

  return (
    <ResumeEntryCollectionFrame>
      {items.map((item) => (
        <EducationEntry key={`${item.institution}-${item.period}`} item={item} />
      ))}
    </ResumeEntryCollectionFrame>
  );
}
