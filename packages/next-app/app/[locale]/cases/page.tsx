import { getCases, getCasesPageCopy } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { CasesPageContent } from '@/components/pages/cases-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const [page, items] = await Promise.all([getCasesPageCopy(locale), getCases(locale)]);
  return createPageMetadata({
    locale,
    pathname: '/cases',
    title: page.title,
    description: page.description,
    index: items.length > 0,
    seo: page.seo,
  });
}

export default async function CasesPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const [items, page] = await Promise.all([getCases(locale), getCasesPageCopy(locale)]);
  return (
    <SiteShell>
      <PageLayout>
        <CasesPageContent page={page} items={items} />
      </PageLayout>
    </SiteShell>
  );
}
