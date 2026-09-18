import { getTopics } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { TopicosPageContent } from '@/components/pages/topicos-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const [topics, t] = await Promise.all([
    getTopics(locale),
    getTranslations({ locale, namespace: 'Pages.topics' }),
  ]);
  return createPageMetadata({
    locale,
    pathname: '/topics',
    title: t('indexTitle'),
    description: t('indexDescription'),
    index: topics.length > 0,
  });
}

export default async function TopicosPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const topics = await getTopics(locale);
  return (
    <SiteShell>
      <PageLayout>
        <TopicosPageContent topics={topics} />
      </PageLayout>
    </SiteShell>
  );
}
