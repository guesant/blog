'use client';

import { useTranslations } from '@/i18n/compat';
import type { PortfolioPageContentProps } from './types';
import { PortfolioPageBody } from './portfolio-page-body';
import { PortfolioPageHeader } from './portfolio-page-header';

export function PortfolioPageContent(props: PortfolioPageContentProps) {
  const tNav = useTranslations('Nav');

  const tHome = useTranslations('Home');

  return (
    <>
      <PortfolioPageHeader page={props.page} profile={props.profile} tNav={tNav} />
      <PortfolioPageBody {...props} tHome={tHome} />
    </>
  );
}
