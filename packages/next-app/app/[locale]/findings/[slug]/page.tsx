import { getReferenceBySlug, getReferences } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { SlugRouteProps } from '@/app/[locale]/route-params';
import { SiteShell } from '@/components/layouts/site-shell';
import { AchadoDetailContent } from '@/components/pages/achado-detail-content';
import { createPageMetadata } from '@/content/seo';

export async function generateStaticParams() {
  return (await getReferences()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(props: SlugRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale, slug } = await params;
  const item = await getReferenceBySlug(slug, locale);
  return item
    ? createPageMetadata({
        locale,
        pathname: `/findings/${item.slug}`,
        title: item.title,
        description: item.description,
        type: 'article',
        publishedTime: item.publishedDateISO,
        seo: item.seo,
      })
    : {};
}

export default async function AchadoDetailPage(props: SlugRouteProps) {
  const { params } = props;
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = await getReferenceBySlug(slug, locale);
  if (!item) {
    notFound();
  }
  return (
    <SiteShell>
      <AchadoDetailContent item={item} />
    </SiteShell>
  );
}
