import type { ReactNode } from 'react';

export type ActionSectionProps = {
  id?: string;
  title?: string;
  description?: ReactNode;
  children: ReactNode;
  divider?: boolean;
};
