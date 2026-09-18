import { getReferencesByTopic, getTopicBySlug, getTopics } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { SlugRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { TopicoDetailContent } from '@/components/pages/topico-detail-content';
import { createPageMetadata } from '@/content/seo';

export async function generateStaticParams() {
  return (await getTopics()).map((topic) => ({ slug: topic.slug }));
}

export async function generateMetadata(props: SlugRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale, slug } = await params;
  const topic = await getTopicBySlug(slug, locale);
  if (!topic) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: 'Pages.topics' });
  return createPageMetadata({
    locale,
    pathname: `/topics/${topic.slug}`,
    title: topic.name,
    description: t('metaDescription', { name: topic.name }),
  });
}

export default async function TopicoDetailPage(props: SlugRouteProps) {
  const { params } = props;
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const topic = await getTopicBySlug(slug, locale);
  if (!topic) {
    notFound();
  }
  const references = await getReferencesByTopic(slug, locale);
  return (
    <SiteShell>
      <PageLayout>
        <TopicoDetailContent topic={topic} references={references} />
      </PageLayout>
    </SiteShell>
  );
}
