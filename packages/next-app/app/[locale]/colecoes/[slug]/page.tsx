import { getReferenceCollectionBySlug, getReferenceCollections } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { SlugRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { ColecaoDetailContent } from '@/components/pages/colecao-detail-content';
import { createPageMetadata } from '@/content/seo';

export async function generateStaticParams() {
  return (await getReferenceCollections()).map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata(props: SlugRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale, slug } = await params;
  const collection = await getReferenceCollectionBySlug(slug, locale);
  return collection
    ? createPageMetadata({
        locale,
        pathname: `/collections/${collection.slug}`,
        title: collection.title,
        description: collection.description,
        seo: collection.seo,
      })
    : {};
}

export default async function ColecaoDetailPage(props: SlugRouteProps) {
  const { params } = props;
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const collection = await getReferenceCollectionBySlug(slug, locale);
  if (!collection) {
    notFound();
  }
  return (
    <SiteShell>
      <PageLayout>
        <ColecaoDetailContent collection={collection} />
      </PageLayout>
    </SiteShell>
  );
}
