'use client';

import { Chip } from '../../ui';
import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import type { Technology } from '@portfolio/data/domain/types';

type TechnologyDetailPageContentProps = { technology: Technology };

export function TechnologyDetailPageContent(props: TechnologyDetailPageContentProps) {
  const { technology } = props;

  const tNav = useTranslations('Nav');

  return (
    <>
      <PageHeader
        title={technology.name}
        breadcrumbs={[{ label: tNav('technologies'), href: '/technologies' }]}
        variant="reading"
      />
      {technology.code && <Chip label={technology.code} />}
    </>
  );
}
