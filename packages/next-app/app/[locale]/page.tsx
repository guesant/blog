import { getHomePageContent, getLatestNotes, getReferenceCollections, getReferences } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { SiteShell } from '../../components/layouts/site-shell';
import { HomeComposite } from '../../components/sections/home-composite';
import { createPageMetadata } from '../../content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const content = await getHomePageContent(locale);
  return createPageMetadata({
    locale,
    pathname: '/',
    title: content.site.seo?.title || `${content.profile.name} — ${content.profile.title}`,
    description: content.site.seo?.description || content.profile.description,
    absoluteTitle: true,
    seo: content.page.seo,
  });
}

export default async function Page(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const [content, writings, findings, collections] = await Promise.all([
    getHomePageContent(locale),
    getLatestNotes(locale),
    getReferences(locale),
    getReferenceCollections(locale),
  ]);
  return (
    <SiteShell>
      <HomeComposite
        content={content}
        writings={writings}
        findings={findings}
        collections={collections}
      />
    </SiteShell>
  );
}
