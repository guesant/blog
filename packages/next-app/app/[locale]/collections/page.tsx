import { getCollectionsPageCopy, getLatestNotes, getReferenceCollections, getReferences } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { ContentFeed } from '@/components/content/content-feed';
import { SiteShell } from '@/components/layouts/site-shell';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const page = await getCollectionsPageCopy(locale);
  return createPageMetadata({
    locale,
    pathname: '/collections',
    title: page.title,
    description: page.description,
    index: true,
    seo: page.seo,
  });
}

export default async function CollectionsPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const [page, writings, findings, collections] = await Promise.all([
    getCollectionsPageCopy(locale),
    getLatestNotes(locale),
    getReferences(locale),
    getReferenceCollections(locale),
  ]);
  return (
    <SiteShell>
      <ContentFeed
        writings={writings}
        findings={findings}
        collections={collections}
        copy={page}
        fixedKind="colecao"
        action="/collections"
      />
    </SiteShell>
  );
}
