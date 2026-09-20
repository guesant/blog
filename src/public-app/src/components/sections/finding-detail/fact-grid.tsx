'use client';

import { Box } from '../../ui';
import type { DetailEntry } from './types';
import { FactEntry } from './fact-entry';

type FactGridProps = { entries: DetailEntry[] };

export function FactGrid(props: FactGridProps) {
  return (
    <Box component="dl" visualVariant="factGrid">
      {props.entries.map((entry) => (
        <FactEntry key={`${entry.label}-${entry.value}`} entry={entry} />
      ))}
    </Box>
  );
}
