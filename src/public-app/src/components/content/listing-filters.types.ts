import type { FormEvent, ReactNode } from 'react';

export type ListingFiltersProps = {
  applyLabel?: string;
  clearLabel?: string;
  onClear?: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  children: ReactNode;
  actions?: ReactNode;
  layout?: 'toolbar' | 'custom';
};
