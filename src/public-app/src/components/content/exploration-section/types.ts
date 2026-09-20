import type { ReactNode } from 'react';

export type ExplorationSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  divider?: boolean;
};
