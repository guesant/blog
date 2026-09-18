import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { CreditsPageContent } from '@/components/pages/credits-page-content';
import { getCreditsPageContent } from '@/content/credits';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const content = await getCreditsPageContent(locale);
  return createPageMetadata({
    locale,
    pathname: '/credits',
    title: content.page.title,
    description: content.page.description,
  });
}

export default async function CreditsPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getCreditsPageContent(locale);

  return (
    <SiteShell>
      <PageLayout>
        <CreditsPageContent content={content} />
      </PageLayout>
    </SiteShell>
  );
}
