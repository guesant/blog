import { getAboutPageCopy, getProfile } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { AboutPageContent } from '@/components/pages/about-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const page = await getAboutPageCopy(locale);
  return createPageMetadata({
    locale,
    pathname: '/about',
    title: page.title,
    description: page.description,
    seo: page.seo,
  });
}

export default async function AboutPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const [profile, page] = await Promise.all([getProfile(locale), getAboutPageCopy(locale)]);

  return (
    <SiteShell>
      <PageLayout>
        <AboutPageContent page={page} profile={profile} />
      </PageLayout>
    </SiteShell>
  );
}
