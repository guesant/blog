import { getExperiments, getProjects, getProjectsPageCopy } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { ProjectsPageContent } from '@/components/pages/projects-page-content';
import { createPageMetadata } from '@/content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const [page, projects, experiments] = await Promise.all([
    getProjectsPageCopy(locale),
    getProjects(locale),
    getExperiments(locale),
  ]);
  return createPageMetadata({
    locale,
    pathname: '/projects',
    title: page.title,
    description: page.description,
    index: projects.length > 0 || experiments.length > 0,
    seo: page.seo,
  });
}

export default async function ProjectsPage(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  setRequestLocale(locale);
  const [projects, experiments, page] = await Promise.all([
    getProjects(locale),
    getExperiments(locale),
    getProjectsPageCopy(locale),
  ]);
  return (
    <SiteShell>
      <PageLayout>
        <ProjectsPageContent page={page} projects={projects} experiments={experiments} />
      </PageLayout>
    </SiteShell>
  );
}
