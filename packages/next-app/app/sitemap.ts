import {
  getAboutPageCopy,
  getCases,
  getCasesPageCopy,
  getContactPageCopy,
  getExperiments,
  getHomePageContent,
  getLatestNotes,
  getProjects,
  getProjectsPageCopy,
  getResumePageCopy,
  getSiteText,
  getWritingPageCopy,
} from '@portfolio/content/server';
import type { MetadataRoute } from 'next';
import { absoluteUrl } from '../content/seo';
import { routing } from '../i18n/routing';

type SitemapSource = {
  locale: string;
  pathname: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>;
  priority: number;
  lastModified?: Date;
};

type SitemapEntry = Omit<SitemapSource, 'locale'> & { locale: string };

type StaticSourcesOptions = {
  locale: string;
  caseCount: number;
  projectCount: number;
  experimentCount: number;
  writingCount: number;
  hasContact: boolean;
  homeNoIndex?: boolean;
  aboutNoIndex?: boolean;
  casesNoIndex?: boolean;
  projectsNoIndex?: boolean;
  writingNoIndex?: boolean;
  contactNoIndex?: boolean;
  resumeNoIndex?: boolean;
};

function sourceIf(include: boolean, source: SitemapEntry): SitemapSource[] {
  return include ? [source] : [];
}

function getStaticSources(props: StaticSourcesOptions): SitemapSource[] {
  const {
    locale,
    caseCount,
    projectCount,
    experimentCount,
    writingCount,
    hasContact,
    homeNoIndex,
    aboutNoIndex,
    casesNoIndex,
    projectsNoIndex,
    writingNoIndex,
    contactNoIndex,
    resumeNoIndex,
  } = props;
  return [
    ...sourceIf(!homeNoIndex, {
      locale,
      pathname: '/',
      changeFrequency: 'weekly',
      priority: 1,
    }),
    ...sourceIf(!aboutNoIndex, {
      locale,
      pathname: '/about',
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
    { locale, pathname: '/license', changeFrequency: 'yearly', priority: 0.3 },
    { locale, pathname: '/credits', changeFrequency: 'yearly', priority: 0.3 },
    ...sourceIf(caseCount > 0 && !casesNoIndex, {
      locale,
      pathname: '/cases',
      changeFrequency: 'monthly',
      priority: 0.9,
    }),
    ...sourceIf((projectCount > 0 || experimentCount > 0) && !projectsNoIndex, {
      locale,
      pathname: '/projects',
      changeFrequency: 'weekly',
      priority: 0.9,
    }),
    ...sourceIf(hasContact && !contactNoIndex, {
      locale,
      pathname: '/contact',
      changeFrequency: 'yearly',
      priority: 0.5,
    }),
    ...sourceIf(!resumeNoIndex, {
      locale,
      pathname: '/resume',
      changeFrequency: 'monthly',
      priority: 0.7,
    }),
    ...sourceIf(writingCount > 0 && !writingNoIndex, {
      locale,
      pathname: '/writing',
      changeFrequency: 'weekly',
      priority: 0.8,
    }),
  ];
}

async function getLocaleSources(locale: string): Promise<SitemapSource[]> {
  const [
    cases,
    projects,
    experiments,
    writings,
    site,
    home,
    aboutPage,
    casesPage,
    projectsPage,
    writingPage,
    contactPage,
    resumePage,
  ] = await Promise.all([
    getCases(locale),
    getProjects(locale),
    getExperiments(locale),
    getLatestNotes(locale),
    getSiteText(locale),
    getHomePageContent(locale),
    getAboutPageCopy(locale),
    getCasesPageCopy(locale),
    getProjectsPageCopy(locale),
    getWritingPageCopy(locale),
    getContactPageCopy(locale),
    getResumePageCopy(locale),
  ]);
  if (site.maintenanceEnabled || site.seo?.noIndex) {
    return [];
  }

  const hasContact = Boolean(site.contact.hasEmail || site.contact.profiles.length > 0);

  return [
    ...getStaticSources({
      locale,
      caseCount: cases.length,
      projectCount: projects.length,
      experimentCount: experiments.length,
      writingCount: writings.length,
      hasContact,
      homeNoIndex: home.page.seo?.noIndex,
      aboutNoIndex: aboutPage.seo?.noIndex,
      casesNoIndex: casesPage.seo?.noIndex,
      projectsNoIndex: projectsPage.seo?.noIndex,
      writingNoIndex: writingPage.seo?.noIndex,
      contactNoIndex: contactPage.seo?.noIndex,
      resumeNoIndex: resumePage.seo?.noIndex,
    }),
    ...cases
      .filter((item) => !item.seo?.noIndex)
      .map((item) => ({
        locale,
        pathname: `/cases/${item.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
    ...projects
      .filter((item) => !item.seo?.noIndex)
      .map((item) => ({
        locale,
        pathname: `/projects/${item.slug}`,
        changeFrequency: item.status.toLowerCase().includes('development')
          ? ('weekly' as const)
          : ('monthly' as const),
        priority: 0.7,
      })),
    ...experiments
      .filter((item) => !item.seo?.noIndex)
      .map((item) => ({
        locale,
        pathname: `/projects/experiments/${item.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
    ...writings
      .filter((item) => !item.seo?.noIndex)
      .map((item) => ({
        locale,
        pathname: `/writing/${item.slug}`,
        changeFrequency: 'yearly' as const,
        priority: 0.7,
        lastModified: item.dateISO ? new Date(item.dateISO) : undefined,
      })),
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sources = (await Promise.all(routing.locales.map(getLocaleSources))).flat();
  const localesByPath = new Map<string, string[]>();

  for (const source of sources) {
    localesByPath.set(source.pathname, [
      ...(localesByPath.get(source.pathname) ?? []),
      source.locale,
    ]);
  }

  return sources.map((source) => {
    const availableLocales = localesByPath.get(source.pathname) ?? [source.locale];
    const fallbackLocale = availableLocales.includes(routing.defaultLocale)
      ? routing.defaultLocale
      : availableLocales[0];
    const languages = Object.fromEntries([
      ...availableLocales.map((locale) => [locale, absoluteUrl(locale, source.pathname)]),
      ['x-default', absoluteUrl(fallbackLocale, source.pathname)],
    ]);

    return {
      url: absoluteUrl(source.locale, source.pathname),
      lastModified: source.lastModified,
      changeFrequency: source.changeFrequency,
      priority: source.priority,
      alternates: { languages },
    };
  });
}
