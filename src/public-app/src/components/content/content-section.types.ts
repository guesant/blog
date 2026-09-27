import type { ReactNode } from 'react';

export type ContentSectionProps = {
  id?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  divider?: boolean;
};
