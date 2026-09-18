import { getExperimentBySlug, getExperiments } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { SlugRouteProps } from '@/app/[locale]/route-params';
import { SiteShell } from '@/components/layouts/site-shell';
import { ExperimentDetailContent } from '@/components/pages/experiment-detail-content';
import { createPageMetadata } from '@/content/seo';

export async function generateStaticParams() {
  return (await getExperiments()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(props: SlugRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale, slug } = await params;
  const experiment = await getExperimentBySlug(slug, locale);
  return experiment
    ? createPageMetadata({
        locale,
        pathname: `/projects/experiments/${experiment.slug}`,
        title: experiment.name,
        description: experiment.purpose,
        seo: experiment.seo,
      })
    : {};
}

export default async function ExperimentDetailPage(props: SlugRouteProps) {
  const { params } = props;
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const experiment = await getExperimentBySlug(slug, locale);
  if (!experiment) {
    notFound();
  }

  return (
    <SiteShell>
      <ExperimentDetailContent experiment={experiment} />
    </SiteShell>
  );
}
