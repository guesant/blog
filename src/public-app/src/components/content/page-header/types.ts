import type { PageIntroduction } from '@portfolio/data/domain/types';
import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '../../navigation/breadcrumbs';

export type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};

export type EditablePageHeaderProps = {
  page: PageIntroduction;
  breadcrumbs?: BreadcrumbItem[];
};

export type DetailHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  meta?: string;
  actions?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
};
