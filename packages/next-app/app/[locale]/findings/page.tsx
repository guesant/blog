import { getAchadosPageCopy, getLatestNotes, getReferenceCollections, getReferences } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { SiteShell } from '@/components/layouts/site-shell';
import { ContentFeed } from '@/components/content/content-feed';
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
      <ContentFeed
        writings={await getLatestNotes(locale)}
        findings={references}
        collections={await getReferenceCollections(locale)}
        copy={page}
        fixedKind="achado"
        action="/findings"
      />
    </SiteShell>
  );
}
