'use client';

import { useTranslations } from '@/i18n/compat';
import { PageHeader } from '../../content/page-header';
import type { ContactPageContentProps } from './types';
import { ContactPageBody } from './contact-page-body';

export function ContactPageContent(props: ContactPageContentProps) {
  const { page: staticPage, site: staticSite } = props;

  const t = useTranslations('Pages.contact');

  const tCommon = useTranslations('Common');

  const tExternalProfiles = useTranslations('ExternalProfiles');

  const tNav = useTranslations('Nav');

  const page = staticPage;

  const site = staticSite;

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={site.contact.available ? page.description : undefined}
        breadcrumbs={[{ label: tNav('contact') }]}
      />
      <ContactPageBody
        page={page}
        site={site}
        t={t}
        tCommon={tCommon}
        tExternalProfiles={tExternalProfiles}
      />
    </>
  );
}
