'use client';

import { SidebarSectionFrame } from '../../ui';
import type { ReactNode } from 'react';

type SidebarSectionProps = { label: string; children: ReactNode };

export function SidebarSection(props: SidebarSectionProps) {
  return <SidebarSectionFrame label={props.label}>{props.children}</SidebarSectionFrame>;
}
