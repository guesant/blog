import type { ElementType, ReactNode } from 'react';

export type ProjectCardFrameProps = {
  children: ReactNode;
  component?: ElementType;
  href?: string;
  underline?: 'none' | 'hover' | 'always';
  color?: string;
};
