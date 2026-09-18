import { getProjectBySlug, getProjects } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { SlugRouteProps } from '@/app/[locale]/route-params';
import { SiteShell } from '@/components/layouts/site-shell';
import { ProjectDetailContent } from '@/components/pages/project-detail-content';
import { createPageMetadata } from '@/content/seo';

export async function generateStaticParams() {
  return (await getProjects()).map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(props: SlugRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale, slug } = await params;
  const project = await getProjectBySlug(slug, locale);
  return project
    ? createPageMetadata({
        locale,
        pathname: `/projects/${project.slug}`,
        title: project.name,
        description: project.purpose,
        seo: project.seo,
      })
    : {};
}

export default async function ProjectDetailPage(props: SlugRouteProps) {
  const { params } = props;
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = await getProjectBySlug(slug, locale);
  if (!project) {
    notFound();
  }

  return (
    <SiteShell>
      <ProjectDetailContent project={project} />
    </SiteShell>
  );
}
