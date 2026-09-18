import { getReferences } from '@portfolio/content/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import type { TypeRouteProps } from '@/app/[locale]/route-params';
import { PageLayout } from '@/components/layouts/page-layout';
import { SiteShell } from '@/components/layouts/site-shell';
import { TipoDetailContent } from '@/components/pages/tipo-detail-content';
import { toMessageKey } from '@/content/achados';
import { createPageMetadata } from '@/content/seo';

export async function generateStaticParams() {
  const references = await getReferences();
  const types = [...new Set(references.map((item) => item.type))];
  return types.map((type) => ({ type }));
}

export async function generateMetadata(props: TypeRouteProps): Promise<Metadata> {
  const { params } = props;
  const { locale, type } = await params;
  const references = (await getReferences(locale)).filter((item) => item.type === type);
  if (references.length === 0) {
    return {};
  }
  const t = await getTranslations({ locale, namespace: 'Pages.achados' });
  const typeLabel = t(`types.${toMessageKey(type)}`);
  return createPageMetadata({
    locale,
    pathname: `/findings/types/${type}`,
    title: typeLabel,
    description: typeLabel,
  });
}

export default async function FindingsTypePage(props: TypeRouteProps) {
  const { params } = props;
  const { locale, type } = await params;
  setRequestLocale(locale);
  const references = (await getReferences(locale)).filter((item) => item.type === type);
  if (references.length === 0) {
    notFound();
  }
  return (
    <SiteShell>
      <PageLayout>
        <TipoDetailContent tipo={type} references={references} />
      </PageLayout>
    </SiteShell>
  );
}
