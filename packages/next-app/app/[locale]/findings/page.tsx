import { getAchadosPageCopy, getReferences } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { AchadosPageContent } from '@/components/pages/achados-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const [page, references] = await Promise.all([getAchadosPageCopy(locale), getReferences(locale)]);
  return createPageMetadata({
    locale,
    pathname: '/findings',
    title: page.title,
    description: page.description,
    index: references.length > 0,
    seo: page.seo,
  });
}

export default async function AchadosPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const [references, page] = await Promise.all([getReferences(locale), getAchadosPageCopy(locale)]);
  return (
    <SiteShell>
      <PageLayout>
        <AchadosPageContent page={page} references={references} />
      </PageLayout>
    </SiteShell>
  );
}
