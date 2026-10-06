import type { ReactNode } from 'react';

export type BreadcrumbItem = { label: string; href?: string; leadingIcon?: ReactNode };

export type BreadcrumbsProps = {
  trail: BreadcrumbItem[];
};
