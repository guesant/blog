'use client';

import { useTranslations } from '@/i18n/compat';
import type { ReactNode } from 'react';
import { EmptyState } from './empty-state';
import { PageHeader } from './page-header';
import { ConditionalContent } from '../primitives/conditional-content';

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
      <ConditionalContent condition={isEmpty}>
        <EmptyState icon="problem">{emptyMessage}</EmptyState>
      </ConditionalContent>
      <ConditionalContent condition={!isEmpty}>{children}</ConditionalContent>
    </>
  );
}
