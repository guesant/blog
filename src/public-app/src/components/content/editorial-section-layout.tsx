import type { ReactNode } from 'react';
import { EditorialSection } from '../ui';

type EditorialSectionLayoutProps = {
  id?: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  divider?: boolean;
};

export function EditorialSectionLayout(props: EditorialSectionLayoutProps) {
  return <EditorialSection {...props} />;
}
