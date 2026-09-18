import { getProfile, getResume, getSiteText } from '@portfolio/content/server';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/martian-mono';
import '@fontsource-variable/source-serif-4';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { LocaleLayoutProps, LocaleRouteProps } from '@/app/[locale]/route-params';
import { AnalyticsConsent } from '../../components/analytics/analytics-consent';
import { WebVitalsReporter } from '../../components/analytics/web-vitals-reporter';
import { MaintenancePage } from '../../components/layouts/maintenance-page';
import { absoluteUrl, siteUrl } from '../../content/seo';
import { routing } from '../../i18n/routing';
import { ThemeRegistry } from '../theme-registry';
import '../fonts.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#F7F9FC',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

function getMetadataAuthor(
  profile: Awaited<ReturnType<typeof getProfile>>,
  site: Awaited<ReturnType<typeof getSiteText>>,
) {
  const github = site.contact.profiles.find((entry) => entry.platform === 'github');
  return github ? { name: profile.name, url: github.url } : { name: profile.name };
}

function getMetadataKeywords(
  site: Awaited<ReturnType<typeof getSiteText>>,
  profile: Awaited<ReturnType<typeof getProfile>>,
  resume: Awaited<ReturnType<typeof getResume>>,
) {
  const keywords = site.seo?.keywords?.filter(Boolean);
  return keywords?.length
    ? keywords
    : [profile.name, profile.title, ...new Set(resume.skills.flatMap((group) => group.items))];
}

function getMetadataText(
  site: Awaited<ReturnType<typeof getSiteText>>,
  profile: Awaited<ReturnType<typeof getProfile>>,
) {
  const defaultTitle = site.seo?.title?.trim() || `${profile.name} — ${profile.title}`;
  const defaultDescription = site.seo?.description?.trim() || profile.description;
  const maintenanceTitle = site.maintenance.title.trim() || defaultTitle;
  const maintenanceDescription = site.maintenance.description.trim() || defaultDescription;
  return { defaultTitle, defaultDescription, maintenanceTitle, maintenanceDescription };
}

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const [profile, site, resume] = await Promise.all([
    getProfile(locale),
    getSiteText(locale),
    getResume(locale),
  ]);
  const { defaultTitle, defaultDescription, maintenanceTitle, maintenanceDescription } =
    getMetadataText(site, profile);
  return {
    metadataBase: siteUrl,
    title: {
      default: site.maintenanceEnabled ? maintenanceTitle : defaultTitle,
      template: `%s · ${profile.name}`,
    },
    description: site.maintenanceEnabled ? maintenanceDescription : defaultDescription,
    applicationName: profile.name,
    authors: [getMetadataAuthor(profile, site)],
    creator: profile.name,
    publisher: profile.name,
    category: 'technology',
    manifest: '/manifest.webmanifest',
    keywords: getMetadataKeywords(site, profile, resume),
    referrer: 'origin-when-cross-origin',
    formatDetection: { email: false, address: false, telephone: false },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    robots:
      site.maintenanceEnabled || site.seo?.noIndex ? { index: false, follow: false } : undefined,
  };
}

export default async function RootLayout(props: LocaleLayoutProps) {
  const { children, params } = props;
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const googleTagManagerId = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;
  const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const [profile, site, resume] = await Promise.all([
    getProfile(locale),
    getSiteText(locale),
    getResume(locale),
  ]);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: absoluteUrl(locale),
    jobTitle: profile.title,
    sameAs: site.contact.profiles.map((profile) => profile.url),
    knowsAbout: [...new Set(resume.skills.flatMap((group) => group.items))],
  };

  return (
    <html lang={locale}>
      <body>
        {!site.maintenanceEnabled && (
          <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON output escapes untrusted content, including < to prevent a script breakout.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'), // nosemgrep: typescript.react.security.audit.react-dangerouslysetinnerhtml.react-dangerouslysetinnerhtml
            }}
          />
        )}
        <NextIntlClientProvider>
          <ThemeRegistry>
            {site.maintenanceEnabled ? (
              <MaintenancePage site={site} profile={profile} />
            ) : (
              <>
                {children}
                <AnalyticsConsent
                  googleTagManagerId={googleTagManagerId}
                  googleAnalyticsId={googleAnalyticsId}
                />
                <WebVitalsReporter enabled={Boolean(googleTagManagerId || googleAnalyticsId)} />
              </>
            )}
          </ThemeRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
