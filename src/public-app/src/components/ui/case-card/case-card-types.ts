import type { ElementType, ReactNode } from 'react';

export type CaseCardFrameProps = {
  children: ReactNode;
  component?: ElementType;
  href?: string;
  underline?: 'none' | 'hover' | 'always';
  color?: string;
};
