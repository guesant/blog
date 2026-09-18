'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import { EmptyState } from './empty-state';
import { PageHeader } from './page-header';

type AchadosIndexLayoutProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  emptyMessage: string;
  isEmpty: boolean;
  children: ReactNode;
};

export function AchadosIndexLayout(props: AchadosIndexLayoutProps) {
  const { title, eyebrow, description, emptyMessage, isEmpty, children } = props;
  const tNav = useTranslations('Nav');

  return (
    <>
      <PageHeader
        eyebrow={eyebrow ?? tNav('achados')}
        title={title}
        description={description}
        breadcrumbs={[{ label: tNav('achados'), href: '/findings' }, { label: title }]}
      />
      {isEmpty ? <EmptyState icon="problem">{emptyMessage}</EmptyState> : children}
    </>
  );
}
