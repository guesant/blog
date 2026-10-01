'use client';

import type { DetailEntry } from './types';
import { FindingFactValueText } from '../../ui/semantic/FindingFactValueText';
import { FactEntryFrame } from '../../ui/semantic/FactEntryFrame';
import { FactEntryText } from '../../ui/semantic/FactEntryText';

type FactEntryProps = { entry: DetailEntry };

export function FactEntry(props: FactEntryProps) {
  const { entry } = props;

  return (
    <FactEntryFrame component="div">
      <FactEntryText component="dt">{entry.label}</FactEntryText>
      <FindingFactValueText component="dd">{entry.value}</FindingFactValueText>
    </FactEntryFrame>
  );
}
