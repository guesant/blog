'use client';

import { ResumeEntryTitle } from '../../ui';
import type { EditableItemNameProps } from './types';

export function EditableItemName(props: EditableItemNameProps) {
  const { item } = props;

  return <ResumeEntryTitle href={item.url}>{item.name}</ResumeEntryTitle>;
}
