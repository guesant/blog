import { getSiteText } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { LicensePageContent } from '@/components/pages/license-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.license' });
  return createPageMetadata({
    locale,
    pathname: '/license',
    title: t('title'),
    description: t('description'),
  });
}

export default async function LicensePage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const site = await getSiteText(locale);

  return (
    <SiteShell>
      <PageLayout>
        <LicensePageContent emailChallenge={site.contact.emailChallenge} />
      </PageLayout>
    </SiteShell>
  );
}
