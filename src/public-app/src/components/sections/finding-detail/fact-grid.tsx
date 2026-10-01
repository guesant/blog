'use client';

import type { DetailEntry } from './types';
import { FactEntry } from './fact-entry';
import { FactGridFrame } from '../../ui/semantic/FactGridFrame';

type FactGridProps = { entries: DetailEntry[] };

export function FactGrid(props: FactGridProps) {
  return (
    <FactGridFrame component="dl" singleColumn={props.entries.length === 1}>
      {props.entries.map((entry) => (
        <FactEntry key={`${entry.label}-${entry.value}`} entry={entry} />
      ))}
    </FactGridFrame>
  );
}
