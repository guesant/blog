'use client';

import { useLocale, useTranslations } from '@/i18n/compat';
import { Breadcrumbs } from '../../navigation/breadcrumbs';
import type { ResumePageContentProps } from './types';
import { ResumeHeader } from './resume-header';
import { ResumePageSections } from './resume-page-sections';
import { ResumeArticle } from './ui/article';

export function ResumePageContent(props: ResumePageContentProps) {
  const { content: staticContent, pdfUrls } = props;

  const t = useTranslations('Pages.resume');

  const tNav = useTranslations('Nav');

  const tExternalProfiles = useTranslations('ExternalProfiles');

  const locale = useLocale();

  const page = staticContent.page;

  const profile = staticContent.profile;

  const site = staticContent.site;

  const hasEmail = site.contact.hasEmail;

  return (
    <ResumeArticle>
      <Breadcrumbs trail={[{ label: tNav('resume') }]} containerVisualVariant="resumeBreadcrumbs" />
      <ResumeHeader
        page={page}
        profile={profile}
        site={site}
        hasEmail={hasEmail}
        locale={locale}
        pdfUrls={pdfUrls}
        t={t}
        tExternalProfiles={tExternalProfiles}
      />

      <ResumePageSections content={staticContent} t={t} />
    </ResumeArticle>
  );
}
