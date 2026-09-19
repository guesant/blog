import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { RandomStringGenerator } from '@/components/tools/random-string-generator';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Pages.toolsRandomStringGenerator' });
  return createPageMetadata({
    locale,
    pathname: '/tools/random-string-generator',
    title: t('title'),
    description: t('description'),
  });
}

export default async function RandomStringGeneratorPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <SiteShell>
      <PageLayout>
        <RandomStringGenerator />
      </PageLayout>
    </SiteShell>
  );
}
