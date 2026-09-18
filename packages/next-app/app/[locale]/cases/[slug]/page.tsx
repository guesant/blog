import { getCaseBySlug, getCases } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { SlugRouteProps } from '@/app/[locale]/route-params';
import { SiteShell } from '@/components/layouts/site-shell';
import { CaseDetailContent } from '@/components/pages/case-detail-content';
import { createPageMetadata } from '@/content/seo';

export async function generateStaticParams() {
  return (await getCases()).map((item) => ({ slug: item.slug }));
}
export async function generateMetadata(props: SlugRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale, slug } = await params;
  const item = await getCaseBySlug(slug, locale);
  return item
    ? createPageMetadata({
        locale,
        pathname: `/cases/${item.slug}`,
        title: item.title,
        description: item.summary,
        type: 'article',
        seo: item.seo,
      })
    : {};
}

export default async function CaseDetailPage(props: SlugRouteProps) {
  const { params } = props;
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = await getCaseBySlug(slug, locale);
  if (!item) {
    notFound();
  }
  return (
    <SiteShell>
      <CaseDetailContent item={item} />
    </SiteShell>
  );
}
