import { getReferenceCollections } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { ColecoesPageContent } from '@/components/pages/colecoes-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const [collections, t] = await Promise.all([
    getReferenceCollections(locale),
    getTranslations({ locale, namespace: 'Pages.collections' }),
  ]);
  return createPageMetadata({
    locale,
    pathname: '/collections',
    title: t('indexTitle'),
    description: t('indexDescription'),
    index: collections.length > 0,
  });
}

export default async function ColecoesPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const collections = await getReferenceCollections(locale);
  return (
    <SiteShell>
      <PageLayout>
        <ColecoesPageContent collections={collections} />
      </PageLayout>
    </SiteShell>
  );
}
