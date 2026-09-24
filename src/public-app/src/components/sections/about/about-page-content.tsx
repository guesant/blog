import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import { AboutEditorialBody } from './about-editorial-body';
import type { AboutPageContentProps } from './types';

export function AboutPageContent(props: AboutPageContentProps) {
  const { page, profile } = props;

  const tNav = useTranslations('Nav');

  return (
    <>
      <PageHeader
        title={page.title}
        breadcrumbs={[{ label: tNav('about') }]}
        visualVariant="aboutPageHeader"
      />
      <AboutEditorialBody page={page} profile={profile} />
    </>
  );
}
