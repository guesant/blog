import type { PageIntroduction } from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '../../navigation/breadcrumbs';
import type { PageHeaderLayout } from '../../ui/page-header';

export type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  meta?: string;
  metadata?: ReactNode;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  layout?: PageHeaderLayout;
};

export type EditablePageHeaderProps = {
  page: PageIntroduction;
  breadcrumbs?: BreadcrumbItem[];
};

export type DetailHeaderProps = Pick<
  PageHeaderProps,
  'title' | 'description' | 'meta' | 'metadata' | 'actions' | 'breadcrumbs'
>;
