'use client';

import type { ReactNode } from 'react';
import { FindingSectionFrame } from '../../ui/semantic/FindingSectionFrame';
import { FindingSectionText } from '../../ui/semantic/FindingSectionText';

type FindingSectionProps = { title: string; children: ReactNode };

export function FindingSection(props: FindingSectionProps) {
  return (
    <FindingSectionFrame component="section">
      <FindingSectionText component="h2">{props.title}</FindingSectionText>
      {props.children}
    </FindingSectionFrame>
  );
}
