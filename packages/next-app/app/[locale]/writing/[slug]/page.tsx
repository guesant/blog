import { getLatestNotes, getWritingBySlug } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { SlugRouteProps } from '@/app/[locale]/route-params';
import { SiteShell } from '@/components/layouts/site-shell';
import { WritingDetailContent } from '@/components/pages/writing-detail-content';
import { createPageMetadata } from '@/content/seo';

export async function generateStaticParams() {
  return (await getLatestNotes()).map((item) => ({ slug: item.slug }));
}
export async function generateMetadata(props: SlugRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale, slug } = await params;
  const item = await getWritingBySlug(slug, locale);
  return item
    ? createPageMetadata({
        locale,
        pathname: `/writing/${item.slug}`,
        title: item.title,
        description: item.excerpt,
        type: 'article',
        publishedTime: item.dateISO,
        seo: item.seo,
      })
    : {};
}

export default async function WritingDetailPage(props: SlugRouteProps) {
  const { params } = props;
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = await getWritingBySlug(slug, locale);
  if (!item) {
    notFound();
  }
  return (
    <SiteShell>
      <WritingDetailContent item={item} />
    </SiteShell>
  );
}
