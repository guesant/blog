'use client';

import type { ComponentType } from 'react';
import { ResumeEntries } from './resume-entries';
import { ResumeEntrySurface } from './resume-entry-surface';

type ResumeEntryCollectionItem = {
  name: string;
  period: string;
  description?: string;
};

type ResumeEntryMetaProps<Item extends ResumeEntryCollectionItem> = {
  item: Item;
};

type ResumeEntryCollectionProps<Item extends ResumeEntryCollectionItem> = {
  items: Item[];
  meta: ComponentType<ResumeEntryMetaProps<Item>>;
};

export function ResumeEntryCollection<Item extends ResumeEntryCollectionItem>(
  props: ResumeEntryCollectionProps<Item>,
) {
  const Meta = props.meta;

  return (
    <ResumeEntries items={props.items}>
      {(item) => (
        <ResumeEntrySurface
          key={`${item.name}-${item.period}`}
          item={item}
          description={item.description}
        >
          <Meta item={item} />
        </ResumeEntrySurface>
      )}
    </ResumeEntries>
  );
}
