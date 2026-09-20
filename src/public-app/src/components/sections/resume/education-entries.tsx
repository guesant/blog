'use client';

import { Box } from '../../ui';
import type { EducationEntriesProps } from './types';
import { EducationEntry } from './education-entry';

export function EducationEntries(props: EducationEntriesProps) {
  const { items } = props;

  return (
    <Box visualVariant="educationEntries">
      {items.map((item) => (
        <EducationEntry key={`${item.institution}-${item.period}`} item={item} />
      ))}
    </Box>
  );
}
