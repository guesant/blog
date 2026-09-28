'use client';

import type { DetailEntry } from './types';
import { FactEntry2Text } from '../../ui/semantic/FactEntry2Text';
import { FactEntryFrame } from '../../ui/semantic/FactEntryFrame';
import { FactEntryText } from '../../ui/semantic/FactEntryText';

type FactEntryProps = { entry: DetailEntry };

export function FactEntry(props: FactEntryProps) {
  const { entry } = props;

  return (
    <FactEntryFrame component="div">
      <FactEntryText component="dt">{entry.label}</FactEntryText>
      <FactEntry2Text component="dd">{entry.value}</FactEntry2Text>
    </FactEntryFrame>
  );
}
