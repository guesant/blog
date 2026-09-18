import { getKnowledgeGraph } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { KnowledgeMapContent } from '@/components/pages/knowledge-map-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const [graph, t] = await Promise.all([
    getKnowledgeGraph(locale),
    getTranslations({ locale, namespace: 'Pages.knowledgeMap' }),
  ]);
  return createPageMetadata({
    locale,
    pathname: '/knowledge-map',
    title: t('title'),
    description: t('description'),
    index: graph.nodes.length > 0,
  });
}

export default async function KnowledgeMapPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const graph = await getKnowledgeGraph(locale);
  return (
    <SiteShell>
      <PageLayout>
        <KnowledgeMapContent nodes={graph.nodes} edges={graph.edges} />
      </PageLayout>
    </SiteShell>
  );
}
