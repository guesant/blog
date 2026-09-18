import { getLatestNotes, getWritingPageCopy } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { WritingPageContent } from '@/components/pages/writing-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const [page, writings] = await Promise.all([getWritingPageCopy(locale), getLatestNotes(locale)]);
  return createPageMetadata({
    locale,
    pathname: '/writing',
    title: page.title,
    description: page.description,
    index: writings.length > 0,
    seo: page.seo,
  });
}

export default async function WritingsPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const [writings, page] = await Promise.all([getLatestNotes(locale), getWritingPageCopy(locale)]);
  return (
    <SiteShell>
      <PageLayout>
        <WritingPageContent page={page} writings={writings} />
      </PageLayout>
    </SiteShell>
  );
}
