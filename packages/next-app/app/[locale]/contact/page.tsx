import { getContactPageCopy, getSiteText } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { ContactPageContent } from '@/components/pages/contact-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const [page, site] = await Promise.all([getContactPageCopy(locale), getSiteText(locale)]);
  const hasContact = Boolean(site.contact.hasEmail || site.contact.profiles.length > 0);
  return createPageMetadata({
    locale,
    pathname: '/contact',
    title: page.title,
    description: page.description,
    index: hasContact,
    seo: page.seo,
  });
}

export default async function ContactPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const [page, site] = await Promise.all([getContactPageCopy(locale), getSiteText(locale)]);

  return (
    <SiteShell>
      <PageLayout>
        <ContactPageContent page={page} site={site} />
      </PageLayout>
    </SiteShell>
  );
}
