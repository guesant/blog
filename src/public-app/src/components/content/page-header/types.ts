import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '../../navigation/breadcrumbs';
import type { PageHeaderVariant } from '../../ui/page-header';

export type PageHeaderProps = {
  title: string;
  titleAdornment?: ReactNode;
  titleAdornmentInline?: boolean;
  description?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  variant?: PageHeaderVariant;
};

export type DetailHeaderProps = Pick<
  PageHeaderProps,
  'title' | 'description' | 'meta' | 'metadata' | 'actions' | 'breadcrumbs'
>;
