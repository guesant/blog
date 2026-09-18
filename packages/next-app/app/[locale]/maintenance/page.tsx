import { getSiteText } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { LocaleRouteProps } from '@/app/[locale]/route-params';
import { createPageMetadata } from '../../../content/seo';

export async function generateMetadata(props: LocaleRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale } = await params;
  const site = await getSiteText(locale);

  return createPageMetadata({
    locale,
    pathname: '/',
    title: site.maintenance.title,
    description: site.maintenance.description,
    absoluteTitle: true,
    index: false,
  });
}

/**
 * IMPORTANT: this route never renders its own markup — `proxy.ts` rewrites every
 * request to `/{locale}/maintenance` while maintenance mode is on, and
 * `[locale]/layout.tsx` swaps in `<MaintenancePage>`. This component only exists
 * for per-locale metadata and to 404 the route when maintenance mode is off; do
 * not delete it as apparent dead code.
 */
export default async function MaintenanceRoute(props: LocaleRouteProps) {
  const { params } = props;
  const { locale } = await params;
  const site = await getSiteText(locale);

  if (!site.maintenanceEnabled) {
    notFound();
  }
  return null;
}
