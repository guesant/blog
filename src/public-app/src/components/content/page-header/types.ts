import type { PageIntroduction } from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '../../navigation/breadcrumbs';

export type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  visualVariant?: string;
};

export type EditablePageHeaderProps = {
  page: PageIntroduction;
  breadcrumbs?: BreadcrumbItem[];
};

export type DetailHeaderProps = {
  title: string;
  description?: string;
  meta?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};
