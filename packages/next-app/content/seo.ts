import { getProfile, getSiteText } from '@portfolio/content/server';
import type { SeoMetadata } from '@portfolio/content/types';
import type { Metadata } from 'next';
import { routing } from '../i18n/routing';

const developmentFallbackSiteUrl = 'http://localhost:3000';
const productionFallbackSiteUrl = 'https://www.guesant.net';

function configuredSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
}

function vercelSiteUrl() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return host ? `https://${host}` : undefined;
}

function fallbackSiteUrl() {
  return process.env.NODE_ENV === 'production'
    ? productionFallbackSiteUrl
    : developmentFallbackSiteUrl;
}

function resolveSiteUrl() {
  const configuredUrl = configuredSiteUrl() ?? vercelSiteUrl() ?? fallbackSiteUrl();
  return new URL(configuredUrl.endsWith('/') ? configuredUrl : `${configuredUrl}/`);
}

export const siteUrl = resolveSiteUrl();

const localeNames = {
  en: 'en_US',
  'pt-BR': 'pt_BR',
} as const;

function normalizePath(pathname: string) {
  if (pathname === '/') {
    return '';
  }
  return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

function localizedPath(locale: string, pathname = '/') {
  const path = normalizePath(pathname);
  return locale === routing.defaultLocale ? path || '/' : `/${locale}${path}`;
}

export function absoluteUrl(locale: string, pathname = '/') {
  return new URL(localizedPath(locale, pathname), siteUrl).toString();
}

function languageAlternates(pathname = '/') {
  return {
    en: absoluteUrl('en', pathname),
    'pt-BR': absoluteUrl('pt-BR', pathname),
    'x-default': absoluteUrl(routing.defaultLocale, pathname),
  };
}

function resolveImageUrl(value?: string) {
  if (!value?.trim()) {
    return undefined;
  }
  try {
    return new URL(value, siteUrl).toString();
  } catch {
    return undefined;
  }
}

function generatedImageUrl(siteName: string, title: string, description: string) {
  const url = new URL('/og', siteUrl);
  url.searchParams.set('site', siteName);
  url.searchParams.set('title', title);
  if (description) {
    url.searchParams.set('description', description);
  }
  return url.toString();
}

type PageMetadataOptions = {
  locale: string;
  pathname: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  index?: boolean;
  seo?: SeoMetadata;
};

type MetadataContentInput = Omit<
  PageMetadataOptions,
  'locale' | 'pathname' | 'absoluteTitle' | 'type' | 'publishedTime'
> & {
  profile: Awaited<ReturnType<typeof getProfile>>;
  site: Awaited<ReturnType<typeof getSiteText>>;
};

type MetadataTextInput = Pick<MetadataContentInput, 'site' | 'title' | 'description' | 'seo'>;

type TextCandidates = Array<string | undefined>;

function firstPresentText(values: TextCandidates) {
  return values.find((value) => value?.trim())?.trim() ?? '';
}

function resolveMetadataTitle(props: MetadataTextInput) {
  const { site, title, seo } = props;
  if (site.maintenanceEnabled) {
    return firstPresentText([site.maintenance.title, title]);
  }
  return firstPresentText([seo?.title, title]);
}

function resolveMetadataDescription(props: MetadataTextInput) {
  const { site, description, seo } = props;
  if (site.maintenanceEnabled) {
    return firstPresentText([site.maintenance.description, site.seo?.description]);
  }
  return firstPresentText([seo?.description, description, site.seo?.description]);
}

function resolveMetadataText(props: MetadataTextInput) {
  return {
    resolvedTitle: resolveMetadataTitle(props),
    resolvedDescription: resolveMetadataDescription(props),
  };
}

function metadataImage(props: MetadataContentInput, title: string, description: string) {
  const { profile, site, seo } = props;
  const url =
    resolveImageUrl(seo?.image || site.seo?.image) ||
    generatedImageUrl(profile.name, title, description);
  const alt = firstPresentText([seo?.imageAlt, site.seo?.imageAlt, title]);
  return { url, alt, width: 1200, height: 630, type: 'image/png' };
}

function metadataKeywords(props: MetadataContentInput) {
  const pageKeywords = props.seo?.keywords?.filter(Boolean);
  return pageKeywords?.length ? pageKeywords : props.site.seo?.keywords?.filter(Boolean);
}

function shouldIndexPage(props: MetadataContentInput) {
  const { site, index, seo } = props;
  return !site.maintenanceEnabled && index && seo?.noIndex !== true && site.seo?.noIndex !== true;
}

function resolveMetadataContent(props: MetadataContentInput) {
  const { site, title, description, seo } = props;
  const { resolvedTitle, resolvedDescription } = resolveMetadataText({
    site,
    title,
    description,
    seo,
  });

  return {
    resolvedTitle,
    resolvedDescription,
    images: [metadataImage(props, resolvedTitle, resolvedDescription)],
    keywords: metadataKeywords(props),
    shouldIndex: shouldIndexPage(props),
  };
}

export async function createPageMetadata(props: PageMetadataOptions): Promise<Metadata> {
  const {
    locale,
    pathname,
    title,
    description,
    absoluteTitle = false,
    type = 'website',
    publishedTime,
    index = true,
    seo,
  } = props;
  const [profile, site] = await Promise.all([getProfile(locale), getSiteText(locale)]);
  const canonical = absoluteUrl(locale, pathname);
  const openGraphLocale = localeNames[locale as keyof typeof localeNames] ?? 'en_US';
  const alternateLocale = Object.values(localeNames).filter((item) => item !== openGraphLocale);
  const { resolvedTitle, resolvedDescription, images, keywords, shouldIndex } =
    resolveMetadataContent({
      profile,
      site,
      title,
      description,
      index,
      seo,
    });

  return {
    title: absoluteTitle || site.maintenanceEnabled ? { absolute: resolvedTitle } : resolvedTitle,
    description: resolvedDescription,
    keywords,
    alternates: {
      canonical,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      type,
      title: resolvedTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: profile.name,
      locale: openGraphLocale,
      alternateLocale,
      images,
      ...(type === 'article'
        ? {
            authors: [absoluteUrl(locale, '/about')],
            publishedTime,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: resolvedTitle,
      description: resolvedDescription,
      images,
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}
