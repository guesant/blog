import { getResumePageContent } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { SiteShell } from '@/components/layouts/site-shell';
import { ResumePageContent } from '@/components/pages/resume-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const content = await getResumePageContent(locale);
  return createPageMetadata({
    locale,
    pathname: '/resume',
    title: content.page.title,
    description: content.page.description,
    seo: content.page.seo,
  });
}

export default async function ResumePage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getResumePageContent(locale);

  return (
    <SiteShell>
      <ResumePageContent content={content} />
    </SiteShell>
  );
}
